from django.contrib import admin

# Register your models here.
from Schedules.models import Day, daily_task

admin.site.register(Day)
admin.site.register(daily_task)