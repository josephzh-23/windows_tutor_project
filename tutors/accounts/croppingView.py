
import base64
import json
import os

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.core import files
from django.core.files.storage import FileSystemStorage, default_storage
from django.http import HttpResponse
from django.shortcuts import redirect, render

#For permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
import cv2
import requests



#This wil be called using an ajax function 
TEMP_PROFILE_IMAGE_NAME = "temp_profile_image.png"
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def crop_image(request, *args, **kwargs):
    
    payload = {}
    user = request.user
    # if request.POST and user.is_authenticated:
    if request.method=="POST":
        try:
            
            data = request.data
            imageString = data.get("image")
            print("user is authenticated")
            url = save_temp_profile_image_from_base64String(imageString, user)
            img = cv2.imread(url)

            cropX = int(float(str(data.get("cropX"))))
            cropY = int(float(str(data.get("cropY"))))
            cropWidth = int(float(str(data.get("cropWidth"))))
            cropHeight = int(float(str(data.get("cropHeight"))))


            if cropX < 0:
                cropX = 0
            if cropY < 0: # There is a bug with cropperjs. y can be negative.
                cropY = 0
            crop_img = img[cropY:cropY+cropHeight, cropX:cropX+cropWidth]

            cv2.imwrite(url, crop_img)

            # delete the old image when you are done 
            user.profile_image.delete()

            # Save the cropped image to user model
            user.profile_image.save("profile_image.png", files.File(open(url, 'rb')))
            user.save()

            payload['result'] = "success"
            payload['cropped_profile_image'] = user.profile_image.url

            # delete temp file upon which we did the cropping 
            os.remove(url)
            
        except Exception as e:
            print("exception: " + str(e))
            payload['result'] = "error"
            payload['exception'] = str(e)
    return HttpResponse(json.dumps(payload), content_type="application/json")


# This fxn will save the img temporarily, save the temp img
# padding exception is for when encoding the base 64 string 

def save_temp_profile_image_from_base64String(imageString, user):
    INCORRECT_PADDING_EXCEPTION = "Incorrect padding"
    try:

        #If path not exists and then make the path 
        # will be based on the user id as you said 
        if not os.path.exists(settings.TEMP):
            os.mkdir(settings.TEMP)
        if not os.path.exists(settings.TEMP + "/" + str(user.pk)):
            os.mkdir(settings.TEMP + "/" + str(user.pk))

        # this is where we store the file 
        url = os.path.join(settings.TEMP + "/" + str(user.pk),TEMP_PROFILE_IMAGE_NAME)
        
        # Create a storage object for use 
        storage = FileSystemStorage(location=url)
        image = base64.b64decode(imageString)
        with storage.open('', 'wb+') as destination:

            #this writes the image to the storage 
            destination.write(image)
            destination.close()
            
        return url
    except Exception as e:
        print("exception: " + str(e))

        # Seems to be some sort of issue down here 
        if str(e) == INCORRECT_PADDING_EXCEPTION:
            imageString += "=" * ((4 - len(imageString) % 4) % 4)
            return save_temp_profile_image_from_base64String(imageString, user)
    return None
