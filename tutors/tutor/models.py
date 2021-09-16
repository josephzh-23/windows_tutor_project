from json import JSONEncoder

from django.db import models
from datetime import datetime

from accounts.models import Account


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


#The default method the same as the JSONEncoder.encode(object)
class UserEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


#Model #2
class Subject(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name



# Here a posting can have more than 1 subjects,
# Therefore many to many field
class Posting(models.Model):
    title = models.CharField(max_length=120)
    author = models.ForeignKey(Account, on_delete=models.CASCADE)
    subject = models.ManyToManyField(Subject)
    body = models.TextField()
    # Good can't do auto_now_add = true here
    publish_date = models.DateTimeField()
    price_per_hour = models.IntegerField(default=0)
    reviewed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    # subclass Post Encoder


class PostingEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__
