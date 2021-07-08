from django.conf import settings
from django.db import models
from django.utils.timezone import now

from tutor.models import Tutor


# Listing associated with tutor 
class Listing(models.Model):

#Modifying the code here 

    #This has to be changed as well 
    tutor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    # realtor = models.ForeignKey(Tutor, on_delete=models.DO_NOTHING)
    slug = models.CharField(max_length=200,blank=True)

    school = models.CharField(max_length=200,blank=True)
    description = models.TextField(blank=True)
    pricePerHour = models.IntegerField(blank=True)

    sex = models.CharField(max_length = 200,blank=True)

    list_date = models.DateTimeField(default=now, blank=True)
    photo_main = models.ImageField(upload_to='photos/%Y/%m/%d/',blank=True)
    photo_1 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)

    bedrooms = models.IntegerField(blank=True)
    is_published = models.BooleanField(default=True)

