from itertools import chain

import json
from accounts.models import Account
from accounts.serializers import AccountSerializer
from django.conf import settings
from django.shortcuts import redirect, render
from private_chat.models import PrivateChatRoom, RoomChatMessage
from rest_framework.decorators import api_view
from rest_framework.response import Response

DEBUG = False


@api_view(('GET',))
def private_chat_room_view(request, *args, **kwargs):
	user = request.user

	# Redirect them if not authenticated
	if not user.is_authenticated:
		return Response("You are not logged in ")
		# return redirect("login")

	# Find all the room that user 1 is a part of 
	rooms1 =PrivateChatRoom.objects.filter(user1 = user, is_active = True)
	rooms2 =PrivateChatRoom.objects.filter(user2 = user, is_active = True)
	# print(room2)
	#2 merge the lists here 
	rooms = list(chain(rooms1, rooms2))
	

	# What we want returned 
	print(str(len(rooms)))

	"""
	m_and_f:
		[{"message": "hey", "friend": "Mitch"}, {"message": "You there?", "friend": "Blake"},]
	Where message = The most recent message
	"""
	m_and_f = []
	for room in rooms:
		#Figure out which user is the other user
		if room.user1 == user:
			friend = room.user2
		elif room.user2 == user:
			friend = room.user1
		

		# need to serialize the friend here 
		serializer = AccountSerializer(friend, many = False)
		m_and_f.append({
			'message': "", # blank msg for now (since we have no messages)
			'friend': serializer.data
		})
		print(m_and_f[0].get('message'))


	context = {}

	context['m_and_f'] = m_and_f
	context['debug'] = DEBUG
	context['debug_mode'] = settings.DEBUG	
	return Response(context)


# Ajax call to return a private chatroom or create one if does not exist
@api_view(['POST'])
def create_or_return_private_chat(request, *args, **kwargs):
	user1 = request.user
	# print(request.data)
	payload = {}

	print('user 1 is ', user1)
	if user1.is_authenticated:
		if request.method == "POST":
			user2_id = request.data['user2_id']


			# User 2 is currently none 
			print('user 2 id is ', user2_id)
			try:
				user2 = Account.objects.get(pk=user2_id)
				chat = find_or_create_private_chat(user1, user2)
				payload['response'] = "Successfully got the chat."
				payload['chatroom_id'] = chat.id
			except Account.DoesNotExist:
				payload['response'] = "Unable to start a chat with that user."
	else:
		payload['response'] = "You can't start a chat if you are not authenticated."
	# return HttpResponse(json.dumps(payload), content_type="application/json")
	
	return Response(payload)


def find_or_create_private_chat(user1, user2):
	try:
		chat = PrivateChatRoom.objects.get(user1=user1, user2=user2)
	except PrivateChatRoom.DoesNotExist:
		try:
			chat = PrivateChatRoom.objects.get(user1=user2, user2=user1)
		except PrivateChatRoom.DoesNotExist:
			chat = PrivateChatRoom(user1=user1, user2=user2)
			chat.save()
	return chat