from django.db import models

# Create your models here.
from tutors import settings

# 1 to 1 relation with


# 1 to many relation with the day of the week
class daily_task(models.Model):

    # We need to restrcit this field
    title = models.CharField(max_length=100)
    start_time = models.TimeField( auto_now= False, blank =True)
    end_time = models.TimeField( auto_now= False, blank =True)

    # Will check for the tasks already created
    # WIll return no overlap if there is none
    def check_no_overlap_task(self, start_time, end_time):
        print("the existing task time", self.start_time , self.end_time)
        #Return 1 if non-overlapping
        if self.start_time < start_time and self.end_time < start_time:
            return -1
        elif self.start_time > start_time and self.start_time > end_time:
            return -1

        #If there is overlap
        else:
            return 1



# If adding a day, make sure the one with same user haven't existed
#Ex: Monday -> only valid for each user once
class Day(models.Model):

    which_day = models.CharField(max_length=10, blank = True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="author")
    tasks = models.ManyToManyField(daily_task)

    #Monday, tuesday and so forth, the related model
    #Can have up to 7 days

    def add_task(self, task):
        if not task in self.tasks.all():

            self.tasks.add(task)
            self.save()

