import asyncio

from accounts.models import Account
from private_chat.constants import DEFAULT_ROOM_CHAT_MESSAGE_PAGE_SIZE
from private_chat.models import PrivateChatRoom, UnreadChatRoomMessages
from friend.models import BuddyList
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from accounts.utils import LazyAccountEncoder


from private_chat.utils import calculate_timestamp, LazyRoomChatMessageEncoder
from asgiref.sync import sync_to_async
from django.core.serializers import serialize
from private_chat.exceptions import ClientError
from datetime import datetime
from django.utils import timezone

from django.core.paginator import Paginator
from private_chat.utils import calculate_timestamp
from private_chat.models import RoomChatMessage
from private_chat.constants import MSG_TYPE_MESSAGE,MSG_TYPE_ENTER,MSG_TYPE_LEAVE
import json
class PrivateChatConsumer(AsyncJsonWebsocketConsumer):

	async def connect(self):
		"""
		Called when the websocket is handshaking as part of initial connection.
		"""
		print("ChatConsumer: connect: " + str(self.scope["user"]))



		# let everyone connect. But limit read/write to authenticated users
		await self.accept()

		# the room_id will define what it means to be "connected". If it is not None, then the user is connected.
		self.room_id = None



	async def receive_json(self, content):
		"""
		Called when we get a text frame. Channels will JSON-decode the payload
		for us and pass it as the first argument.
		"""
		# Messages will have a "command" key we can switch on
		print("ChatConsumer: receive_json")
		command = content.get("command", None)
		try:
			if command == "join":
				print("joining room: " + str(content['room']))
				await self.join_room(content["room"])
			elif command == "leave":
				self.leave_room(content["room"])
			elif command == "send":

				if len(content["message"].lstrip())!=0:
					await self.send_room(content["room"], content["message"])

			elif command == "get_room_chat_messages":
				await self.display_progress_bar(True)
				room = await get_room_or_error(content['room_id'], self.scope["user"])

				
				payload = await get_room_chat_messages(room, content['page_number'])
				if payload != None:
					payload = json.loads(payload)

					await self.send_messages_payload(payload['messages'], payload['new_page_number'])
				else:
					raise ClientError(204,"Something went wrong retrieving the chatroom messages.")
				await self.display_progress_bar(False)

			elif command == "get_user_info":

				await self.display_progress_bar(True)
				print("the user here is ", self.scope["user"])
				room = await get_room_or_error(content['room_id'], self.scope["user"])
				payload = await get_user_info(room, self.scope["user"])

				print(payload)
				if payload != None:
					payload = json.loads(payload)
					await self.send_user_info_payload(payload['user_info'])
				else:
					raise ClientError(204, "Something went wrong retrieving the other users account details.")
				await self.display_progress_bar(False)
		except ClientError as e:
			await self.display_progress_bar(False)

			await self.handle_client_error(e)	




	async def disconnect(self, code):
		"""
		Called when the WebSocket closes for any reason.
		"""
		# Leave the room
		print("ChatConsumer: disconnect")
		try:
			if self.room_id != None:
				await self.leave_room(self.room_id)
		except Exception as e:
			print("EXCEPTION: " + str(e))
			pass


#Will send the room id back to user 
#and send another command. 
#ask user to get info about his/her friend
	async def join_room(self, room_id):
		"""
		Called by receive_json when someone sent a join command.
		"""
		# The logged-in user is in our scope thanks to the authentication ASGI middleware (AuthMiddlewareStack)
		print("ChatConsumer: join_room: " + str(room_id))

		try:
			room = await get_room_or_error(room_id, self.scope["user"])
			print(room)
		except ClientError as e:

			return await self.handle_client_error(e)
			# print(e)

		# Add user to "users" list for room
		await connect_user(room, self.scope["user"])
		#Store that we are in the room 
		# Update our room id, so we are in the room 

		self.room_id = room.id


		# This is used to reset count of msg
		await on_user_connected(room, self.scope["user"])

		# Add them to the group so they get room messages
		await self.channel_layer.group_add(
			room.group_name,
			self.channel_name,
		)
		# Instruct their client to finish opening the room
		await self.send_json({
			"join": str(room.id),
		})

		if self.scope["user"].is_authenticated:
			# Notify the group that someone joined
			await self.channel_layer.group_send(
				room.group_name,
				{
					"type": "chat.join",
					"room_id": room_id,
					"profile_image": self.scope["user"].profile_image.url,
					"username": self.scope["user"].username,
					"user_id": self.scope["user"].id,
				}
			)


	async def leave_room(self, room_id):
		"""
		Called by receive_json when someone sent a leave command.
		"""
		# The logged-in user is in our scope thanks to the authentication ASGI middleware
		print("ChatConsumer: leave_room")

		room = await get_room_or_error(room_id, self.scope["user"])

		#Remove from the list
		await disconnect_user(room, self.scope['user'])



		# Notify the group that someone left
		await self.channel_layer.group_send(
			room.group_name,
			{
				"type": "chat.leave",
				"room_id": room_id,
				"profile_image": self.scope["user"].profile_image.url,
				"username": self.scope["user"].username,
				"user_id": self.scope["user"].id,
			}
		)


		# Remove that we're in the room
		self.room_id = None

		# Remove them from the group so they no longer get room messages
		await self.channel_layer.group_discard(
			room.group_name,
			self.channel_name,
		)
		# Instruct their client to finish closing the room
		await self.send_json({
			"leave": str(room.id),
		})



	async def send_room(self, room_id, message):
		"""
		Called by receive_json when someone sends a message to a room.
		"""
		print("ChatConsumer: send_room")
		# Check they are in this room
		if self.room_id != None:
			if str(room_id) != str(self.room_id):
				print("CLIENT ERRROR 1")
				raise ClientError("ROOM_ACCESS_DENIED", "Room access denied")
		else:
			print("CLIENT ERRROR 2")
			raise ClientError("ROOM_ACCESS_DENIED", "Room access denied")

		# Get the room and send to the group about it
		room = await get_room_or_error(room_id, self.scope["user"])

		connected_users = room.connected_users.all()

		#Using async here, you can make things faster
		# Execute these functions asychronously
		await asyncio.gather(*[

			# Here we are doing it for both users
			# If they are not in connected list, create unread msg notify

			#Increase the count
			append_unread_msg_if_not_connected(room, room.user1, connected_users, message),
			append_unread_msg_if_not_connected(room, room.user2, connected_users, message),
			create_room_chat_message(room, self.scope["user"], message)
		])

		await create_room_chat_message(room, self.scope["user"], message)

		await self.channel_layer.group_send(
			room.group_name,
			{
				"type": "chat.message",
				"profile_image": self.scope["user"].profile_image.url,
				"username": self.scope["user"].username,
				"user_id": self.scope["user"].id,
				"message": message,
			}
		)


	# These helper methods are named by the types we send - so chat.join becomes chat_join
	async def chat_join(self, event):
		"""
		Called when someone has joined our chat.
		"""
		# Send a message down to the client
		print("ChatConsumer: chat_join: " + str(self.scope["user"].id))
		if event["username"]:
			await self.send_json(
				{
					"msg_type": MSG_TYPE_ENTER,
					"room": event["room_id"],
					"profile_image": event["profile_image"],
					"username": event["username"],
					"user_id": event["user_id"],
					"message": event["username"] + " connected.",
				},
			)

	
	async def chat_leave(self, event):
		"""
		Called when someone has left our chat.
		"""
		# Send a message down to the client
		print("ChatConsumer: chat_leave")
		if event["username"]:
			await self.send_json(
			{
				"msg_type": MSG_TYPE_LEAVE,
				"room": event["room_id"],
				"profile_image": event["profile_image"],
				"username": event["username"],
				"user_id": event["user_id"],
				"message": event["username"] + " disconnected.",
			},
		)
	async def leave_room(self, room_id):
		"""
		Called by receive_json when someone sent a leave command.
		"""
		# The logged-in user is in our scope thanks to the authentication ASGI middleware
		print("ChatConsumer: leave_room")

		room = await get_room_or_error(room_id, self.scope["user"])

		# Notify the group that someone left
		await self.channel_layer.group_send(
			room.group_name,
			{
				"type": "chat.leave",
				"room_id": room_id,
				"profile_image": self.scope["user"].profile_image.url,
				"username": self.scope["user"].username,
				"user_id": self.scope["user"].id,
			}
		)

		# Instruct their client to finish closing the room
		await self.send_json({
			"leave": str(room.id),
		})
		self.roomId = None

		#Remove user from group
		await self.channel_layer.group_discard(
			room.group_name,
			self.channel_name		)

		#Instruct client to finish  closing the room

	async def send_messages_payload(self, messages, new_page_number):
		"""
		Send a payload of messages to the ui
		"""
		print("ChatConsumer: send_messages_payload. ")

		await self.send_json(
			{
				"messages_payload": "messages_payload",
				"messages": messages,
				"new_page_number": new_page_number,
			},
		)

	async def send_user_info_payload(self, user_info):
		"""
		Send a payload of user information to the ui
		"""
		print("ChatConsumer: send_user_info_payload. ")
		await self.send_json(
			{
				"user_info": user_info,
			},
		)
	async def handle_client_error(self, e):
		"""
		Called when a ClientError is raised.
		Sends error data to UI.
		"""
		errorData = {}
		errorData['error'] = e.code
		if e.message:
			errorData['message'] = e.message
			await self.send_json(errorData)
		return
		
	async def chat_message(self, event):
		"""
		Called when someone has messaged our chat.
		"""
		# Send a message down to the client
		print("ChatConsumer: chat_message")


		
		timestamp = calculate_timestamp(timezone.now())

		await self.send_json(
			{
				"msg_type": MSG_TYPE_MESSAGE,
				"username": event["username"],
				"user_id": event["user_id"],
				"profile_image": event["profile_image"],
				"message": event["message"],
				"natural_timestamp": timestamp,
			},
		)

	async def display_progress_bar(self, is_displayed):
		"""
		1. is_displayed = True
		- Display the progress bar on UI
		2. is_displayed = False
		- Hide the progress bar on UI
		"""
		print("DISPLAY PROGRESS BAR: " + str(is_displayed))
		await self.send_json(
			{
				"display_progress_bar": is_displayed
			}
		)

@database_sync_to_async
def get_room_or_error(room_id, user):
	"""
	Tries to fetch a room for the user, checking permissions along the way.
	"""
	try:
		room = PrivateChatRoom.objects.get(pk=room_id)
	except PrivateChatRoom.DoesNotExist:
		raise ClientError("ROOM_INVALID", "Invalid room.")

	# Is this user allowed in the room? (must be user1 or user2)
	if user != room.user1 and user != room.user2:
		raise ClientError("ROOM_ACCESS_DENIED", "You do not have permission to join this room.")

	# Are the users in this room friends?
	friend_list = BuddyList.objects.get(user=user).buddies.all()
	if not room.user1 in friend_list:
		if not room.user2 in friend_list:
			raise ClientError("ROOM_ACCESS_DENIED", "You must be friends to chat.")
	return room



@sync_to_async
def get_user_info(room, user):

	try:
		# Determine who is who
		other_user = room.user1
		if other_user== user:
			other_user = room.user2
		data ={}
		s = LazyAccountEncoder()

			# convert to list for serializer and select first entry (there will be only 1)
		data['user_info'] = s.serialize([other_user])[0]
		return json.dumps(data)
	except Exception as e:
		print(e)

	
@database_sync_to_async
def create_room_chat_message(room, user, message):
	return RoomChatMessage.objects.create(user=user, room=room, content=message)


	
@database_sync_to_async
def get_room_chat_messages(room, page_number):
    try:
        qs = RoomChatMessage.objects.by_room(room)
        p = Paginator(qs, DEFAULT_ROOM_CHAT_MESSAGE_PAGE_SIZE)

        payload = {}
        messages_data = None
        new_page_number = int(page_number)  
        if new_page_number <= p.num_pages:
            new_page_number = new_page_number + 1
            s = LazyRoomChatMessageEncoder()
            payload['messages'] = s.serialize(p.page(page_number).object_list)
        else:
            payload['messages'] = "None"
        payload['new_page_number'] = new_page_number
        return json.dumps(payload)
    except Exception as e:
        print("EXCEPTION: " + str(e))
        return None


@database_sync_to_async
def connect_user(room, user):
	# add user to connected_users list
	account = Account.objects.get(pk=user.id)
	return room.connect_user(account)


@database_sync_to_async
def disconnect_user(room, user):
	# remove from connected_users list
	account = Account.objects.get(pk=user.id)
	return room.disconnect_user(account)


# If the user is not connected to the chat, increment "unread messages" count
@database_sync_to_async
def append_unread_msg_if_not_connected(room, user, connected_users, message):
	if not user in connected_users:
		try:
			unread_msgs = UnreadChatRoomMessages.objects.get(room=room, user=user)
			unread_msgs.most_recent_message = message


			# This will trigger pre_save receiver in the model
			#When calling save() with the pre_save()
			unread_msgs.count += 1
			unread_msgs.save()
		except UnreadChatRoomMessages.DoesNotExist:
			UnreadChatRoomMessages(room=room, user=user, count=1).save()
			pass
	return

# When a user connects, reset their unread message count
@database_sync_to_async
def on_user_connected(room, user):

	# confirm they are in the connected users list
	connected_users = room.connected_users.all()
	if user in connected_users:
		try:
			# reset count
			unread_msgs = UnreadChatRoomMessages.objects.get(room=room, user=user)
			unread_msgs.count = 0
			unread_msgs.save()
		except UnreadChatRoomMessages.DoesNotExist:
			UnreadChatRoomMessages(room=room, user=user).save()
			pass
	return

