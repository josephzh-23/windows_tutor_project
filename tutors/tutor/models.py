from django.db import models
from datetime import datetime


def upload_path(instance, filename):
    return '/'.join(['pictures', str(instance.name), filename])

# Setting up the tutor model 
class Tutor(models.Model):
    name = models.CharField(max_length=50)
    subject = models.CharField(max_length=50)
    school = models.CharField(max_length= 50)
    email = models.CharField(max_length=100)
    filename = models.ImageField(blank= True, null = True, upload_to=upload_path)
    top_tutor = models.BooleanField(default=False)
    date_hired = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return self.name
# Create your models here.
