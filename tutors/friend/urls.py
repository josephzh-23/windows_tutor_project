
from django.urls import path

from friend.views import(
	sendFriendRequest,
    accept_friend_request,
    removeFriend,
    decline_friend_request,
    cancel_friend_request,
   show_friend_list,
    friendRequests
)

app_name = 'friend'

urlpatterns = [
    path('friendRequest/', sendFriendRequest, name='friend-request'),
    path('friend_list_view/', show_friend_list),

    path('friendRequests/', friendRequests, name='friend-requests'),
     path('friend_request_accept/', accept_friend_request, name='friend-request-accept'),
     path('removeFriend/', removeFriend),
     path('decline_friend_request/', decline_friend_request, name='friend-request-decline'),
path('cancel_friend_request/', cancel_friend_request, name='friend-request-decline'),
]