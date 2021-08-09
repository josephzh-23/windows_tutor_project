"""tutors URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

#  frmo this directory
# from . import views

  
from django.conf import settings
from django.conf.global_settings import MEDIA_ROOT
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from upload import views

urlpatterns = [
    #Need slash for sure here

# WIll u
 
    path('api-auth/', include('rest_framework.urls')),

    path('private_chat/', include('private_chat.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('accounts/', include('accounts.urls')),
        path('tutor/', include('tutor.urls')),
          path('admin/', admin.site.urls),
          path('friend/', include('friend.urls')),
    path('schedule/', include('Schedules.urls')),

    # path('api/realtors/', include('realtors.urls')),
    path('api/listings/', include('listings.urls')),
    path('api/contacts/', include('contacts.urls')),
    path('api/contacts/', include('contacts.urls')),

    # The following for the uploads section

    path('', views.Home.as_view(), name='home'),
    path('upload/', views.upload, name='upload'),
    path('books/', views.book_list, name='book_list'),
    path('books/upload/', views.upload_book, name='upload_book'),
    path('books/<int:pk>/', views.delete_book, name='delete_book'),

    path('class/books/', views.BookListView.as_view(), name='class_book_list'),
    path('class/books/upload/', views.UploadBookView.as_view(), name='class_upload_book'),


] 

# 
# Allow one to view the image file 
# urlpatterns += static(settings.MEDIA_URL,document_root= settings.MEDIA_ROOT)
# urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]


#This will be where all the uploaded files will be stored
#Static folder and the media folder
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)