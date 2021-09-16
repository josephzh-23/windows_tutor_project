from django.conf.urls import url
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import create_schedule, get_user_schedule, replace_user_schedule

# router = DefaultRouter()
# router.register("getschedule",Schedule_Viewset, basename="schedules")
urlpatterns = [
    # url('', include(router.urls)),
    path('create/', create_schedule),
    path('getschedule/', get_user_schedule),
    path('replace/', replace_user_schedule)
]