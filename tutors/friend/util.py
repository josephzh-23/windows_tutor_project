from friend.models import FriendRequest

# has to match both receiver and sender 
def get_friend_request_or_false(sender, receiver):
	try:
		return FriendRequest.objects.get(sender=sender, receiver=receiver, isActive=True)
	except FriendRequest.DoesNotExist:
		return False