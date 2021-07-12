from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from rest_framework.authtoken.models import Token
from django.conf import settings
from json import JSONEncoder
import datetime
# Token created here too 


import json
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.db import models
from friend.models import BuddyList

class UserAccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(email=email, username = username)

        user.set_password(password)
        user.save()

        return user
    
    def create_superuser(self, email, username, password):
        user = self.create_user(email, username, password)

        user.is_superuser = True
        user.is_staff = True
        user.is_admin  = True
        user.save()

        return user
        
#With the file to the user name 
# Our static files are in the media folder 
def get_default_image():
    return "pickachu.png"

def get_profile_image_filepath(self, filename):
	return 'profile_images/' + str(self.pk) + '/profile_image.png'


class Account(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    hide_email= models.BooleanField(default=True)
    is_superuser = models.BooleanField(default = False)
    
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True, blank = True)
    profile_image= models.ImageField(max_length=255, upload_to=get_profile_image_filepath, null=True, blank=True, default=get_default_image)
	
    # hide_email= models.BooleanField(default=True)
    last_login= models.DateTimeField(verbose_name='last login', auto_now=True)
   
    # tie the account to the super manager 
    objects = UserAccountManager()

    #Important here it means we are logging in with the email 
    #And the required name is the name here 
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def get_full_name(self):
        return self.username
    
    def get_short_name(self):
        return self.username

    #select substring between 2 indexes 
    def get_profile_image_filename(self):
	    return str(self.profile_image)[str(self.profile_image).index('profile_images/' + str(self.pk) + "/"):]
    def __str__(self):
        return self.email
    # Check if the admin has all the permissions 
    def has_permission(self, perm, obj = None):
        return self.is_admin

    # Does this user have permission to view this app? (ALWAYS YES FOR SIMPLICITY)
    def has_module_perms(sef, app_label):
        return True

    def toJson(self):
        if isinstance(self, datetime.date):
            return json.dumps(self, default =dict(year = self.year, month = self.month, day = self.day))
        else:    
            return json.dumps(self, default=lambda o: o.__dict__)
	# Check if user has permission to view this class 

#The default method the same as the JSONEncoder.encode(object)
class UserEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__
        
@receiver(post_save, sender = settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance = None, created = False, **kwargs):
    if created:
        Token.objects.create(user = instance)
        
#When user is created; an empty friendlist is created 
@receiver(post_save, sender=Account)
def user_save(sender, instance, **kwargs):
    BuddyList.objects.get_or_create(user=instance)