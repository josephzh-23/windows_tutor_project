from django.urls import path


from private_chat.views import private_chat_room_view,create_or_return_private_chat

app_name = 'private_chat'


urlpatterns = [
	# Here would be the home page 
	path('', private_chat_room_view, name='private-chat-room'),

	path('create_or_get_private_chat/', create_or_return_private_chat, name='create-or-return-private-chat')
]