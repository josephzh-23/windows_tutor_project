from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.
# Will contain the appointment model for each tutor and student
from tutors import settings


class Appointment(models.Model):

    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="appt_sender")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="appt_receiver")

    # We need to restrcit this field
    title = models.CharField(max_length=100, null= True)
    start_time = models.TimeField(auto_now=False, blank=True)
    end_time = models.TimeField(auto_now=False, blank=True)

    price = models.IntegerField(default=0)  # cents

    def __str__(self):
        return self.title

    def get_display_price(self):
        return "{0:.2f}".format(self.price / 100)


# When appointment is created by student
    # An appointment created for tutor as well
    def create(self):
        pass

