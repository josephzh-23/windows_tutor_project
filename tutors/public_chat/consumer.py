import json
from datetime import datetime, timezone
from asgiref.sync import sync_to_async

from private_chat.exceptions import ClientError
from private_chat.models import PrivateChatRoom
from public_chat.serializer import LazyRoomChatMessageEncoder
from django.utils import timezone
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.conf import settings
from django.conf.global_settings import AUTH_USER_MODEL
from django.contrib.auth import get_user_model
from django.contrib.humanize.templatetags.humanize import naturalday
from django.core.paginator import Paginator

from public_chat.models import PublicChatRoom, PublicRoomChatMessage



DEFAULT_ROOM_CHAT_MESSAGE_PAGE_SIZE = 10 
# from chat.models import PublicChatRo


MSG_TYPE_MESSAGE =0 #For standard messages 
MSG_TYPE_CONNECTED_USER_COUNT = 1 	#For showing # of connected users 

User = settings.AUTH_USER_MODEL

# Example taken from:
# https://github.com/andrewgodwin/channels-examples/blob/master/multichat/chat/consumers.py
class PublicChatConsumer(AsyncJsonWebsocketConsumer):

	auth_user = None
	async def connect(self):
		"""
		Called when the websocket is handshaking as part of initial connection.
		"""
		print("PublicChatConsumer: connect: " + str(self.scope["user"]))
		
		#This lets 
		#  let everyone connect. But limit read/write to authenticated users
		
	
		#Add users to a group so they can now be subscribed
		# Add them to the group so they get room messages
		await self.channel_layer.group_add(
			"public_chatroom_1",
			self.channel_name,
		)


		await self.accept()
	async def disconnect(self, code):
		"""
		Called when the WebSocket closes for any reason.
		"""
		# leave the room

		print(code)
		# print(self.scope)
		print("PublicChatConsumer: disconnect")
		try:
			if self.room_id != None:
				await self.leave_room(self.room_id)
		except Exception:
			pass


	async def receive_json(self, content):
			"""
			Called when we get a text frame. Channels will JSON-decode the payload
			for us and pass it as the first argument.
			"""
			# Messages will have a "command" key we can switch on
			command = content.get("command", None)
			# print("PublicChatConsumer: receive_json: " + str(command))
			
			try:
				if command == "send":
					if len(content["message"].lstrip()) != 0:
							# Here the room is the same as room id 
					# print(content["room"])
						await self.send_room(content["room_id"], content["message"])
					else:
						raise ClientError(422,"You can't send an empty message.")
					
				elif command == "join":
					# Make them join the room
					await self.join_room(content["room"])
				elif command == "leave":
					# Leave the room
					await self.leave_room(content["room"])


				elif command == "get_room_chat_messages":
					await self.display_progress_bar(True)
					room_id = await get_room_or_error(content['room_id'],self.scope["user"])
					payload = await get_room_chat_messages(
						room_id, content['page_number'])
					
					if payload != None:
						payload = json.loads(payload)
						print(payload['new_page_number'])
						await self.send_messages_payload_to_ui(payload['messages'], payload['new_page_number'])
					else:
						raise ClientError(204,"Something went wrong retrieving the chatroom messages.")
					await self.display_progress_bar(False)
			except ClientError as e:
				await self.handle_client_error(e)
				
			

	#Send msg to all subscribers
	async def send_message(self,message):
		await self.channel_layer.group_send(
			"public_chatroom_1",
			{
				"type": "chat.message",
				# chat.message will be interpreted as chat_message

				"profile_image": self.scope["user"].profile_image.url,
				"username": self.scope["user"].username,
				"user_id": self.scope["user"].id,
				"message": message,
			}
		)
	async def chat_message(self, event):
			"""
			Called when someone has messaged our chat.
			"""
			# Send a message down to the client
			print("PublicChatConsumer: chat_message from user #" + str(event["user_id"]))
		
			timestamp = calculate_timestamp(timezone.now())
			

		#Add in the time stamp here 
		#Send data to the socket 
			await self.send_json(
				{
					"msg_type": MSG_TYPE_MESSAGE,
					"profile_image": event["profile_image"],
					"username": event["username"],
					"user_id": event["user_id"],
					"message": event["message"],
					"natural_timestamp": timestamp,
				},
			)

# THis is called after the socket has been established 
# 	Called by receive_json when someone sent a join command.
	async def join_room(self, room_id):
		
		print(f"PublicChatConsumer: join_room ${room_id}")
		is_auth = is_authenticated(self.scope["user"])
		try:
			user = self.scope['user']

			# modified for edge
			room = await get_room_or_error(room_id, user )

			# If no public room with id 1 is found,
			# need to then create one for the first time

			if room is None and room_id == 1:
				print("No public chat room found")
				# Forcefully create a id=1 chatroom
				room = await create_public_room_chat_message(room, self.scope['user'],
													  "joseph")

		except ClientError as e:
			await self.handle_client_error(e)

		# print("the room is ", room)
		# Add user to "users" list for room
		if is_auth:
			await connect_user(room, self.scope["user"])

		# Store that we're in the room
		self.room_id = room.id

		# Add them to the group so they get room messages
		await self.channel_layer.group_add(
			room.group_name,
			self.channel_name,
		)

		# Instruct their client to finish opening the room
		await self.send_json({
			"join": str(room.id)
		})

		num_connected_users = await get_num_connected_users(room)
		await self.channel_layer.group_send(
			room.group_name,
			{
				# Notice here it's actually calling the function 
				# connected_user_count 
				"type": "connected.user.count",
				"connected_user_count": num_connected_users
			}
		)

	
	async def leave_room(self, room_id):
		"""
		Called by receive_json when someone sent a leave command.
		"""
		print("PublicChatConsumer: leave_room")
		is_auth = is_authenticated(self.scope["user"])
		room = await get_room_or_error(room_id,self.scope["user"] )

		#IF the user is found then
		# Remove user from "users" list

		if is_auth:
			await disconnect_user(room, self.scope["user"])

		# Remove that we're in the room
		self.room_id = None
		# Remove them from the group so they no longer get room messages
		await self.channel_layer.group_discard(
			room.group_name,
			self.channel_name,
		)	
	
		# send the new user count to the room
		num_connected_users = await get_num_connected_users(room)
		await self.channel_layer.group_send(
			room.group_name,
			{
				"type": "connected.user.count",
				"connected_user_count": num_connected_users
			}
		)

	# WHen sb sends a msg to a room here 
	async def send_room(self, room_id, message):
		"""
		Called by receive_json when someone sends a message to a room.
		"""
		# Check if the user is in the room or not 
		print("PublicChatConsumer: send_room")

		# This person was in a room 
		print("room id is ", self.room_id)
		if self.room_id != None:
			 
			# You can only send message to your own room 
			print(self.room_id)
			if str(room_id) != str(self.room_id):
				raise ClientError("ROOM_ACCESS_DENIED", "Room access denied")

			print('user is ', self.scope['user'])

			# Here we can't use the scope user 
			room = await get_room_or_error(room_id,self.scope["user"])
			await create_public_room_chat_message(room, self.scope['user'],
			message)
			if not is_authenticated(self.scope["user"]):
				raise ClientError("AUTH_ERROR", "You must be authenticated to chat.")
		else:
			raise ClientError("ROOM_ACCESS_DENIED", "Room access denied")

		#If they are in the room 
		# Get the room and send to the group about it
		room = await get_room_or_error(room_id,self.scope["user"])

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
	#Called when client error is raise 
	# Send data error to the UI 
	async def handle_client_error(self, e):
	
		errorData = {}
		errorData['error'] = e.code

		if e.message:
			errorData['message'] = e.message
		await self.send_json(errorData)

	async def connected_user_count(self, event):
		"""
		Called to send the number of connected users to the room.
		This number is displayed in the room so other users know how many users are connected to the chat.
		"""
		# Send a message down to the client
		print("PublicChatConsumer: connected_user_count: count: " + str(event["connected_user_count"]))
		await self.send_json(
			{
				"msg_type": MSG_TYPE_CONNECTED_USER_COUNT,
				"connected_user_count": event["connected_user_count"]
			},
		)

#Called after getting all the messagess 
	async def send_messages_payload_to_ui(self,messages, new_page_number ):

		# Send payload of messages to ui
		await self.send_json({
			"messages_payload": "messages_payload",
			"messages": messages,
			"new_page_number": new_page_number,
		})



	async def display_progress_bar(self, is_displayed):
		"""
		1. is_displayed = True
		- Display the progress bar on UI
		2. is_displayed = False
		- Hide the progress bar on UI
		"""
		# print("DISPLAY PROGRESS BAR: " + str(is_displayed))
		await self.send_json(
			{
				"display_progress_bar": is_displayed
			}
		)

def is_authenticated(user):
	if user.is_authenticated:
		return True
	return False



@database_sync_to_async
def connect_user(room, user):
	return room.connect_user(user)

@database_sync_to_async
def disconnect_user(room, user):
	return room.disconnect_user(user)


#Been modified
#Get a room for the user here 
@database_sync_to_async
def get_room_or_error(room_id, user):
	room =None
	try:
		room = PublicChatRoom.objects.get(pk=room_id)
	except:
		print("room not found")
	if room is None and room_id == 1:
		print("No public chat room found")

		# Forcefully create a id=1 chatroom
		room = PublicChatRoom.objects.create(title= "joseph")

		room.users.add(user)

	# except PublicChatRoom.DoesNotExist:
	# 	raise ClientError("ROOM_INVALID", "Invalid room.")
	return room
class ClientError(Exception):
	"""
	Custom exception class that is caught by the websocket receive()
	handler and translated into a send back to the client.
	"""
	def __init__(self, code, message):
		super().__init__(code)
		self.code = code
		if message:
			self.message = message

@database_sync_to_async
def get_num_connected_users(room):
	#Shows the # of connected users
	if room.users:
		return len(room.users.all())
	return 0
@database_sync_to_async
def create_public_room_chat_message(room, user, message):

	print("Message is created here")
	return PublicRoomChatMessage.objects.create(user= user, room = room, 
	content = message)

@database_sync_to_async

def get_room_chat_messages(room, page_number):
	try:
		# Will filter the messages by the room by_room
		qs = PublicRoomChatMessage.objects.by_room(room)

		# pass the queryset size 
		p = Paginator(qs, DEFAULT_ROOM_CHAT_MESSAGE_PAGE_SIZE)

		payload = {}
		messages_data = None

		# Getting the page number here
		# num_pages: how many pages there r, 
		new_page_number = int(page_number)  

		#THis means we have not reached the end of results (pagination)
		if new_page_number <= p.num_pages:

			# Then we increment the page number 
			new_page_number = new_page_number + 1
			s = LazyRoomChatMessageEncoder()
		
		# Also check if the message fetched belongs to current user
			# for message in p.page(page_number).object_list:
				
			payload['messages'] = s.serialize(p.page(page_number).object_list)
		
		#THis means we have reached end of results 
		else:
			payload['messages'] = "None"

		payload['new_page_number'] = new_page_number
		return json.dumps(payload)
	except Exception as e:
		print("EXCEPTION: " + str(e))
		return None



def calculate_timestamp(timestamp):
	"""
	1. Today or yesterday:
		- EX: 'today at 10:56 AM'
		- EX: 'yesterday at 5:19 PM'
	2. other:
		- EX: 05/06/2020
		- EX: 12/28/2020
	"""
	ts = ""
	# Today or yesterday
	if (naturalday(timestamp) == "today") or (naturalday(timestamp) == "yesterday"):
		str_time = datetime.strftime(timestamp, "%I:%M %p")
		
		str_time = str_time.strip("0")
		ts = f"{naturalday(timestamp)} at {str_time}"
	# other days
	else:
		str_time = datetime.strftime(timestamp, "%m/%d/%Y")
		ts = f"{str_time}"
	return str(ts)
