# mysite/asgi.py
import os

from channels.security.websocket import AllowedHostsOriginValidator
from public_chat.consumer import PublicChatConsumer
from private_chat.consumer import PrivateChatConsumer
from django.urls.conf import path, re_path
from public_chat.token_authentication import QueryAuthMiddleware
from channels.auth import AuthMiddlewareStack
# from tutors.routing import ws_urlpatterns
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tutors.settings')

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#    "websocket": QueryAuthMiddleware(
#        URLRouter([
#          path("public_chat/<room_id>/", PublicChatConsumer.as_asgi()),
#        ]))
# })

application = ProtocolTypeRouter({
	'websocket': QueryAuthMiddleware(
		AuthMiddlewareStack(
		 URLRouter([
            #    re_path(r'public_chat/(?P<room_name>\w+)/$', PublicChatConsumer.as_asgi()),
             path("public_chat/<room_id>/", PublicChatConsumer.as_asgi()),

			 # A socket for the private chat
			 path("private_chat/<room_id>/", PrivateChatConsumer.as_asgi())

         ])
            #  # Empty for now because we don't have a consumer yet.
		)
	),
})