# This is a callable class, very useful
import re
from urllib.parse import parse_qs

from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from peewee import DoesNotExist
from rest_framework.authtoken.models import Token

# This file used exclusively with the authtoekn as a 
# top level wrapper middle ware 

from django.contrib.auth.models import AnonymousUser


@database_sync_to_async
def get_user(token_key):
    try:
        print(token_key)

        #Dirty hack to extract the token

                
        if ";" in token_key:
            idx= token_key.find(';')
            actual_token = token_key[:idx]
            return Token.objects.get(key=actual_token).user
            print("actual token is", actual_token)
        else:
            return Token.objects.get(key=token_key).user
        
    except Token.DoesNotExist:
        return AnonymousUser()


# def get_user(scope):
#     try: 
#         token_key = parse_qs(scope["query_string"].decode("utf8"))["token"][0]
#         token = Token.objects.get(key = token_key)
#         return token.user

#     except Token.DoesNotExist:
#         return AnonymousUser()
#     except KeyError:
#         return AnonymousUser()


class QueryAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """
    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).

        # print(scope)


        #Get the header information
        headers = dict(scope["headers"])
        # print(headers[b"cookie"])

        print("The header is ", headers)
        # print(headers)
        if b"authorization" in headers[b"cookie"]:
            print('still good here')
            cookies = headers[b"cookie"].decode()
            
            token_key_2= ()
            # Here there will be 2 authentication key-value pairs we want the second one 
            # print(cookies)
            # token_key = re.search("authorization=(.*)(; )?", cookies).group(1)
            token_key_1= re.search("authorization=(.*)(;)?", cookies).group(1)
            try: 
                #This returns a tuple
                token_key_2= re.search("authorization=(.*)(;)?", token_key_1).group(1)
            except Exception:
                print("no 2nd authorization token ")


            if len(token_key_2) == 0:
                scope["user"] = await get_user(token_key_1)
            else:
                scope["user"] = await get_user(token_key_2)

            # print("the token key is ", token_key_2)
            # if token_key:
            #     scope["user"] = await get_user(token_key)
                
            #     print(" The websocket user is ", scope["user"])
            # scope['user'] = await get_user(int(scope["query_string"]))

        return await self.app(scope, receive, send)

# The following is very useful
# # THis is used as a callalble in asgi 
# class TokenAuthMiddleware:
# # self refers to the AuthMiddleWare stack that we mentioned
#     def __init__(self,inner):
#         print(self)

#         print(inner)
#         self.inner = inner
    
#     # The call accepts scope from the parent's class (sth on top of the TokenMiddleWare)
#     def __call__(self, scope):
#         return TokenAuthMiddlewareInstance(scope, self)


# # Used because of aysnc 
# class TokenAuthMiddlewareInstance:
#     def __init__(self, scope, middleware):
#         self.scope = dict(scope)
#         self.inner = middleware.inner

# # send is called when consumer sends sth 
#     async def __call__(self, receive, send):
#         self.scope['user'] = await get_user(self.scope)
#         inner = self.inner(self.scope)
#         return await inner(receive, send)
