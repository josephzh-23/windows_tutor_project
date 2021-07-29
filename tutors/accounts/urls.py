from django.urls import path

from tutor.views import search_posting
from .views import SignupView, account_view, login_view, logout_view, account_search_view, edit_account_view, \
    testing_android
from rest_framework.authtoken.views import obtain_auth_token
from .croppingView import crop_image
urlpatterns= [
        # path('register/', register_view),
    path('signup/', SignupView.as_view()),
    # a default view from the framework 
    # get the token 

    # Send an email and password to this 
     path('gettoken', obtain_auth_token),
     path('login/', login_view),
     path('logout', logout_view, name="logout"),
     path('search/', account_search_view, name ="register"),
     path('accountView/', account_view, name="view"),
    path('<user_id>/accountUpdate/',edit_account_view, name="edit"),
    path('<user_id>/edit/cropImage/', crop_image, name="crop_image"),
path('testing_android',testing_android, name="android"),

    path('search_posting/', search_posting, name="search_posting")
]