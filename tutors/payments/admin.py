from django.contrib import admin

# Register your models here.
from payments.models import Appointment

admin.site.register(Appointment)