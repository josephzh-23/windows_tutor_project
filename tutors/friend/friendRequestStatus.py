from enum import Enum


class FriendRequestStatus(Enum):
	NO_REQUEST_SENT = -1

	#Your friend sent the request to you
	THEM_SENT_TO_YOU = 0
	YOU_SENT_TO_THEM = 1
