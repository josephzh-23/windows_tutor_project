from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import render, redirect
from os.path import isabs
from django.core import serializers
import json
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth import get_user_model
from rest_framework import permissions
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import AccountSerializer
from accounts.models import Account
from django.conf import settings
from .forms import RegistrationForm, AccountUpdateForm, AccountAuthenticationForm

from friend.friendRequestStatus import FriendRequestStatus
from friend.models import BuddyList, FriendRequest
from friend.util import get_friend_request_or_false
User = get_user_model()


#This fxn is similar to get_room_chat_messages
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def account_search_view(request, *args, **kwargs):
    print(request)
    if request.method == "GET":


        #Page number for pagination
        pageNum = request.GET.get("pageNum")
        print(pageNum)

        data= {}
        # q is the search parameter here and then 
        search_query = request.GET.get("q")
        print(search_query)
        if len(search_query) > 0:
            
            searchResults = Account.objects.filter(Q(email__icontains=search_query)|Q(username__icontains=search_query))

            #apply the pagination here so only a few results returned
            # and
            p = Paginator(searchResults, per_page =1)


            '''Need to send back the new page number '''
            if int(pageNum) <=p.num_pages:
                # Return item starting at the 1st page
                # and it gets incremented

                search_results = p.page(pageNum)
                print(search_results)
                user = request.user
                print(user)
                accounts = [] # [(account1, True), (account2, False), ...]

                if user.is_authenticated:
                    # get the authenticated users friend list
                    auth_user_friend_list = BuddyList.objects.get(user=user)
                    for account in search_results:
                        serializer = AccountSerializer(account, many = False)

                        accounts.append((serializer.data, auth_user_friend_list.is_mutual_friend(account)))
                    data['accounts'] = accounts
                else:
                    for account in search_results:

                        print(account.profile_image.url)
                        print(account.profile_image)
                        serializer = AccountSerializer(account, many = False)
                        accounts.append((serializer.data,False))

                        # you have no friends yet
                    # context['accounts'] = accounts

                    new_page_number = int(pageNum)+1
                    data['accounts'] = accounts
                    data['new_page_nubmer'] = new_page_number
            else:
                return None
    return Response(accounts)



# Use this for the registration
class SignupView(APIView):
    permission_classes = (permissions.AllowAny, )

    #Register the user here 
    def post(self, request, format=None):
        data = self.request.data

        print(data)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password1')
        password2 = data.get('password2')
        role = data.get('role')

        if password == password2:
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'})
            else:
                if len(password) < 6:
                    return Response({'error': 'Password must be at least 6 characters'})
                else:

                    #create_user is a native function
                    user = User.objects.create_user(email=email, password=password,
                                                    username=username,role =role)
                    
                    #Returning the token created 
                    token = Token.objects.get(user=user).key

                    #Also show that the message user created successfully
                    data['userId'] = user.id
                    data['token'] = token
                    data.update({'message':'user successfully created'})
                    user.save()
                    return Response(data)
        else:
            return Response({'error': 'Passwords do not match'})


#Here an account
# Calls the login() fxn on request
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request, *args, **kwargs):

    print(request.data)
    context = {}
    user = request.user
    print(user)
    if user.is_authenticated: 
        print('right here')
        return redirect("home")

    destination = get_redirect_if_exists(request)
    print("destination: " + str(destination))

    if request.method =="POST":
        form = AccountAuthenticationForm(request.data)
        if form.is_valid():
            email = request.data.get('email')
            password = request.data.get('password')
            user = authenticate(email=email, password=password)

            data ={}
            if user:
                login(request, user)
                token = Token.objects.get(user=user).key
                print(email)
                username = Account.objects.get(email = email).username
                userId = user.id


                # if destionation:
                # 	return redirect(destination)
                data['token'] = token
                print("joseph")
                # return Response(data)

                return Response({'token': token, 'userId': userId,
                                 'username': username})


    else:
        form = AccountAuthenticationForm()

    context['login_form'] = form
    print(form.errors)
    return Response(form.errors)
# A 2nd way to regiser the user using just the function 


# @api_view(['POST'])
# @permission_classes([permissions.AllowAny])
# def register_view(request, *args, **kwargs):
# 	err = ""
# 	user = request.user
# 	print(request.data)
# 	if user.is_authenticated: 
# 		return HttpResponse("You are already authenticated as " + str(user.email))

# 	context = {}
# 	if request.method =='POST':
# 		print("i am cool")
# 		form = RegistrationForm(request.data)

# 		# If error, we return the form with the error 
# 		# this matches with html : for error in field.errors code 

# 		# authenticate() creates the account 
# 		# which logs you in()
        
# 		if form.is_valid():
# 			form.save()
# 			email = form.cleaned_data.get('email').lower()
# 			raw_password = form.cleaned_data.get('password1')

# 			account = authenticate(email=email, password=raw_password)
            
# 			login(request, account)
# 			destination = kwargs.get("next")
# 			# if destination:
# 			# 	return redirect(destination)

# 			#'home' name of a route is in the url.py file and then you can do this 
                
# 			# return redirect('home')

# 		# this is the case with the form with error 	
# 		else:
# 			context['registration_form'] = form
# 			print(context)
# 			err = form.errors

# In the case not a post request 
    # else:
    # 	form = RegistrationForm()
    # 	context['registration_form'] = form

    # if err == "":
    # 	return JsonResponse({"msg":"user registered"})
    # else:
    # 	return Response({'error' : err})

@api_view(['POST'])
def logout_view(request):
    print('user is', request.user)
    logout(request)

    # return redirect("home")
    return Response('ok')


# This allows user to get to whereeve he wants to go 
def get_redirect_if_exists(request):
    redirect = None
    if request.GET:
        if request.GET.get("next"):
            redirect = str(request.GET.get("next"))
    return redirect


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
#The account page returned as per individual user
def testing_android(request, *args, **kwargs):

    data = {}
    data["joseph"] = 0
    
    #Make sure this is seialized
    return JsonResponse(json.dumps(data), safe= False)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
#The account page returned as per individual user 
def account_view(request, *args, **kwargs):

    # User 	-> 	logged in user
    #Account -> the account we are looking at 
    """
    - Logic here is kind of tricky
        is_self (boolean)
            is_friend (boolean)
                -1: NO_REQUEST_SENT
                0: THEM_SENT_TO_YOU
                1: YOU_SENT_TO_THEM
    """
    data = {}

 #Here the userId passed in thru query params 
    user_id = request.GET.get('userId')
    print('user request is ' , user_id)

    try:
        account = Account.objects.get(pk=user_id)
        print(account)
        print(account.profile_image)
    except:
        return HttpResponse("Something went wrong.")

        #Remember to serialize the account to pass it back
    if account:
        print(account)
        serializer = AccountSerializer(account, many= False)

        # Get friend list of the account we are looking at 
        try:
            friendList = BuddyList.objects.get(user = account)

        except BuddyList.DoesNotExist:
            friendList = BuddyList(user = account)
            friendList.save()
            
        #The user has friends now 
        # The friends are deleted from viewee's account,
        # not the viewer's account
        friends = friendList.buddies.all()
        print('here the friends are ', friends)

        # Define template variables
        isSelf = True
        isFriend = False
        request_sent = FriendRequestStatus.NO_REQUEST_SENT.value # range: ENUM -> friend/friend_request_status.FriendRequestStatus
        friendRequests = None

        user = request.user
        print(user)
        requests = []

# not looking at own account
        if user.is_authenticated and user != account:
            isSelf = False

            # THis checks if the user is a friend of the profile user
            # he is viewing 
            if friends.filter(pk=user.id):
                isFriend = True
            else:
                isFriend = False
        
                #Checking for the cases 
                    # CASE1: Request has been sent from THEM to YOU: FriendRequestStatus.THEM_SENT_TO_YOU
                if get_friend_request_or_false(sender=account, receiver=user) != False:
                    request_sent = FriendRequestStatus.THEM_SENT_TO_YOU.value
                    data['pending_friend_request_id'] = get_friend_request_or_false(sender=account, receiver=user).id
                
                # CASE2: Request has been sent from YOU to THEM: FriendRequestStatus.YOU_SENT_TO_THEM
                elif get_friend_request_or_false(sender=user, receiver=account) != False:
                    request_sent = FriendRequestStatus.YOU_SENT_TO_THEM.value
                
                # CASE3: No request sent from YOU or THEM: FriendRequestStatus.NO_REQUEST_SENT
                # No request inititated at all
                else:
                    request_sent = FriendRequestStatus.NO_REQUEST_SENT.value 

        elif not user.is_authenticated:
            isSelf = False

# THis is for when u looking at your own profile
        else:
            print('looking at my own profile')
            isSelf= True
            try: 
                requests = []
                friendRequests = FriendRequest.objects.filter(receiver= user,
                is_active = True).values()
                print(friendRequests)
                for request in friendRequests:
                    print(request)
                    requests.append(request)
            except Exception as e:
                raise e


        # Need to seriazlie the friends data here before passing back
        friends_serialized= AccountSerializer(friends, many= True)

        # print('the request is ', requests)
        # Need to add seriazliers here since we now have friends 
        print(friends_serialized.data)
        print('cool')
        data['account'] = serializer.data
        data['isSelf'] = isSelf
        data['isFriend'] = isFriend
        data['friends'] = friends_serialized.data
        
        data['baseURL'] =settings.BASE_URL
        data['friendRequests'] = requests
        data['requestSent'] = request_sent


        #Add role data

        return Response(data)
        # return render(request, "account/account.html", context)
        
# not looking at own account
        if user.is_authenticated and user != account:
            is_self = False

            # THis checks if the user is a friend of the profile user
            # he is viewing 
            if friends.filter(pk=user.id):
                isFriend = True
            else:
                isFriend = False
        
                #Checking for the cases 
                    # CASE1: Request has been sent from THEM to YOU: FriendRequestStatus.THEM_SENT_TO_YOU
                if get_friend_request_or_false(sender=account, receiver=user) != False:
                    request_sent = FriendRequestStatus.THEM_SENT_TO_YOU.value
                    data['pending_friend_request_id'] = get_friend_request_or_false(sender=account, receiver=user).id
                
                # CASE2: Request has been sent from YOU to THEM: FriendRequestStatus.YOU_SENT_TO_THEM
                elif get_friend_request_or_false(sender=user, receiver=account) != False:
                    request_sent = FriendRequestStatus.YOU_SENT_TO_THEM.value
                
                # CASE3: No request sent from YOU or THEM: FriendRequestStatus.NO_REQUEST_SENT
                # No request inititated at all
                else:
                    request_sent = FriendRequestStatus.NO_REQUEST_SENT.value 

        elif not user.is_authenticated:
            isSelf = False

        # THis is for when u looking at your own profile
        else:
            try:
                friendRequests = FriendRequests.objects.filter(receiver= user,
                is_active = True)
            except Exception as e:
                raise e

        data['isSelf'] = isSelf
        data['isFriend'] = isFriend
        data['baseURL'] =settings.BASE_URL
        data['friendRequests'] = friendRequests
        data['requestSent'] = request_sent

        return Response(data)
        # return render(request, "account/account.html", context)
        

@api_view(['POST', 'GET'])
@permission_classes([permissions.AllowAny])
def edit_account_view(request, *args, **kwargs):

    # We need a way to validate the user data 
    # 4 things
    # username, email profile_image, hide_email

    #todo: will add this back later on 
    # if not request.user.is_authenticated:
    # 	return redirect("login")
    user_id = kwargs.get("user_id")
    print(request.user)
    account = Account.objects.get(pk=user_id)

    print(account.pk)
    if account.pk != request.user.pk:
        return HttpResponse("You cannot edit someone elses profile.")
    context = {}

    if request.POST:
        form = AccountUpdateForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():

            #Here we can deete the old profile image
            account.profile_image.delete()
            
            form.save()
            new_username = form.cleaned_data['username']
            # return redirect("account:view", user_id=account.pk)
            return Response(context)
        else:
            form = AccountUpdateForm(request.POST, instance=request.user,
                initial={
                    "id": account.pk,
                    "email": account.email, 
                    "username": account.username,
                    "profile_image": account.profile_image,
                    "hide_email": account.hide_email,
                }
            )
            context['form'] = form
    
    
    # If a "get" request here 
    else:
        form = AccountUpdateForm(
            initial={
                    "id": account.pk,
                    "email": account.email, 
                    "username": account.username,
                    "profile_image": account.profile_image,
                    "hide_email": account.hide_email,
                }
            )
        context['form'] = form
    context['DATA_UPLOAD_MAX_MEMORY_SIZE'] = settings.DATA_UPLOAD_MAX_MEMORY_SIZE
    # return render(request, "account/edit_account.html", context)
    return Response(context)


def search_tutor_view(request):
    if request.method == 'POST':
        search_query = request.GET.get("q")





# @api_view(['POST', ])
# def registration_view(request):

# 	if request.method == 'POST':
# 		serializer = RegistrationSerializer(data=request.data)
# 		data = {}
# 		if serializer.is_valid():
# 			account = serializer.save()
# 			data['response'] = 'successfully registered new user.'
# 			data['email'] = account.email
# 			data['username'] = account.username
# 		else:
# 			data = serializer.errors
# 		return Response(data)