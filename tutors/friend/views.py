from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import BuddyList
from Util.util import turn_QuerySet_to_Json
from accounts.models import Account
from friend.admin import FriendRequest
from accounts.serializers import AccountSerializer




# THe user id passed in is the id of user being removed
@api_view(['POST'])
def removeFriend(request, *args):

	user = request.user
	err=None
	#Remove friend from both user and 
	if request.method == "POST" and user.is_authenticated:

		# This is the id of friend clicked on 
		user_id = request.data.get('receiverUserId')
		print(user_id)
	
		if user_id:
			try:

		#Get the account and 
				removee= Account.objects.get(pk =user_id)
				removeeFriendList = BuddyList.objects.get(user = user)

				removeeFriendList.unfriend(removee)
				res = "Friend is now removed"
			except Exception as e:
				err = str(e)
				print(e)
		else:
			err= "there was an error, can't remove your friend"
	else:
		err = "You are not authenticated"
	
	if err:
		return Response({'err':err})
	else:
		return Response({'res':res
		})
# Create your views here.
@api_view(['POST'])
def sendFriendRequest(request, *args, **kwargs):

	user = request.user
	data = {}
	if request.method == "POST" and user.is_authenticated:

		# Receiver is the id of the profile of person
		print(request.data)
		user_id = request.data
		if user_id:
			receiver = Account.objects.get(pk=user_id)
			try:
				# Get any friend requests (active and not-active)
				buddyRequests = FriendRequest.objects.filter(sender=user, receiver=receiver)
				
                # find if any of them are active (pending)
				try:
					for request in buddyRequests:
						if request.is_active:
							raise Exception("A studying buddy request has already been sent here ")
					
                    
                    # If no active friend request then create a new one 
                    # and save to database 
					friendRequest = FriendRequest(sender=user, receiver=receiver)
					friendRequest.save()
					data['response'] = "Friend request sent."
				except Exception as e:
					data['response'] = str(e)

			except FriendRequest.DoesNotExist:
				# There are no friend requests so create one.
				friend_request = FriendRequest(sender=user, receiver=receiver)
				friend_request.save()
				data['response'] = "Friend request sent."

			if data['response'] == None:
				data['response'] = "Something went wrong."
		else:
			data['response'] = "Unable to sent a friend request."
	else:
		data['response'] = "You must be logged in to send a friend request."
	# return HttpResponse(json.dumps(data), content_type="application/json")
	return Response(data)

@api_view(['GET'])
def accept_friend_request(request):

	#THe authentaicted user 
	user = request.user
	data= {}
	err=""
	if request.method =="GET" and user.is_authenticated:

		friend_request_id = request.GET.get('requestId')

		#Confirm that the receiver is the currently logged in user 
		if friend_request_id:
			friendRequest = FriendRequest.objects.get(pk = friend_request_id)

			if friendRequest.receiver== user:
				if friendRequest:
					friendRequest.accept()

					data['res'] = "Friend request accepted"
				else:
					err = "An error occured"
			else:
				err = "You can't accept this request"
		else:
			err = "Request not found"
		
	else:
		err= "you are not authenticated"

	if err:
		return Response(err)
	else:
		return Response(data)





@api_view(['GET'])
def decline_friend_request(request):
	user = request.user

	data = {}
	err = None
	if request.method == "GET" and user.is_authenticated:
		friend_request_id = request.GET.get('friend_request_id')
		friendRequest = FriendRequest.objects.get(id = friend_request_id)

		if friendRequest.receiver == user:
			if friendRequest:
				try:
					friendRequest.decline()	
					res = 'successfully declined the request'
				except Exception as e:
					err = str(e)
					raise e	
			
			else:
				err="you did not receive this friend request"
		
		else:
			err= "Not your own account"
	else:
		err= "you are not authentiacted"
	
	if err:
		return Response({'err': err})
	else:
		return Response({'res':res})	

@api_view(['POST'])
def cancel_friend_request(request):
	res = None
	err =None
	user = request.user
	payload = {}
	if request.method == "POST" and user.is_authenticated:
		user_id = request.data.get('receiver_user_id')
		print(request)
		if user_id:
			receiver = Account.objects.get(pk=user_id)
			try:
				friend_requests = FriendRequest.objects.filter(sender=user, receiver=receiver, is_active=True)
			except FriendRequest.DoesNotExist:
				err = "Nothing to cancel. Friend request does not exist."

			# There should only ever be ONE active friend request at any given time. Cancel them all just in case.
			if len(friend_requests) > 1:
				for request in friend_requests:
					request.cancel()
				res= "Friend request canceled."
			
			#Only 1 request is found 
			else:
				# found the request. Now cancel it
				friend_requests.first().cancel()
				res = "Friend request canceled."
		else:
			err = "Unable to cancel that friend request."
	else:
		# should never happen
		err = "You must be authenticated to cancel a friend request."
	
	if err:
		return Response({'err': err})
	else:
		return Response({'res':res})



#Show all the friends available
@api_view(['GET'])
def show_friend_list(request):

	data={}
	user = request.user

	if user.is_authenticated:

		# This user id is the user whose friendlist we 
		# are currently looking at 
		user_id = request.GET.get('user_id')
		if user_id:
			try:

				#This_user :user whose friendlist we 
				# are currently looking at 
				this_user = Account.objects.get(pk=user_id)
				serializer = AccountSerializer(this_user, many= False)
				data['this_user'] = serializer.data
			
			except Account.DoesNotExist:
				data['err'] = "this user does not exist "
				return Response(data)

			try:
				viewee_friend_list = BuddyList.objects.get(user=this_user)
			except viewee_friend_list.DoesNotExist:
				data['err'] = f"Could not find a friends list for {this_user.username}"
				return Response(data)
				
			# The key thing 
			#Users must be friends to view the acocunt list


			#If this is not your own account 
			if user != this_user:
				if not user in viewee_friend_list.buddies.all():
					data["err"] = "You ahve to be this user's friend to see his/her friend list"
				
			#The hard part:
			# Create a list of [account, boolean] -> whether you are friend with
			# the friend of the profile viewee

			friends = []  #[(account1, True), (account2, False)]
			logged_in_user_friendList = BuddyList.objects.get(user = user)

			print(viewee_friend_list)
			for friend in viewee_friend_list.buddies.all():
				friend_serializer = AccountSerializer(friend, many= False)
				friends.append((friend_serializer.data, logged_in_user_friendList.is_mutual_friend(friend)))
			data["friends"] = friends 

	else:
		data["err"] = "You are not authenticated right now"
	
	return Response(data)


#This will show all the friend requests 
@api_view(['GET'])
def friendRequests(request, *args):

	data = {}

	#Carry all friend request ids
	friendRequestIds = []
	print('this is hit')
	user = request.user 
	if user.is_authenticated:
		user_id = request.GET.get('userId')
		print('user request is ' , user_id)

		# The account you are looking at 
		account = Account.objects.get(pk=user_id)


		# if looking at own profile
		# You can see the friend requests sent to you
		if user == account:
			friendRequestList = FriendRequest.objects.filter(receiver= account, is_active = True)
			
			# SHow all the senders of the fxn
			senders =[]

			#Get related sender data 
			for req in friendRequestList:
				print(req.receiver)
				friendRequestIds.append(req.id)
				print(friendRequestIds)
				senders.append(req.sender)
			
			serializer = AccountSerializer(senders, many = True)
			
			print(senders)
			
			return Response({'sendersData': serializer.data, 'friendRequestIds':friendRequestIds} )
		else:
			return Response({'error': "you can't see another user's friend requests"})

	else:
		return Response({'error': 'need to be logged in '})

