from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.
# Will contain the appointment model for each tutor and student
from tutors import settings

User = get_user_model()
class Appointment(models.Model):

    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="apptSender")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="apptReceiver")

    name = models.CharField(max_length=100)
    # We need to restrcit this field
    title = models.CharField(max_length=100)
    start_time = models.TimeField(auto_now=False, blank=True)
    end_time = models.TimeField(auto_now=False, blank=True)

    price = models.IntegerField(default=0)  # cents
    file = models.FileField(upload_to="product_files/", blank=True, null=True)
    url = models.URLField()

    def __str__(self):
        return self.name

    def get_display_price(self):
        return "{0:.2f}".format(self.price / 100)


# When appointment is created by student
    # An appointment created for tutor as well
    def create(self):
        pass

