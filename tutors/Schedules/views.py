from datetime import datetime, time

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from Schedules.models import Day, daily_task


# This will be called each time user selects a range of schedule
#
from Schedules.serializer import DaySerializer


@api_view(['POST'])
def create_schedule(request):
    print(request.data)

    user = request.user
    #Extract periods of each day
    #For each period of day, need to create a task
    #and save it to that day
    for eachDay in request.data:

        day_received = eachDay.get('which_day')
        print('day received is ', day_received)
        # Get day of the week
        # Create a day with the user, if not exists

        the_day, created = Day.objects.get_or_create(user=user, which_day=day_received)
        the_day.save()

        print("Created boolean is ", created)
        '''
        We need to iterate thru each tasks in the day
        and check make sure no overlapping time

        if nooverlapping  ->    will then add the task
        '''

        time_period_list = eachDay.get('periodArray')
        for period in time_period_list:
            print('the period is ', period)

            if period != "":
                time = period.split('-')
                start = time[0].strip()
                start_time = datetime.strptime(start, '%H:%M').time()
                end = time[1].strip()
                end_time = datetime.strptime(end, '%H:%M').time()

                print('start and end time is', start, end)
                #Create a task with the start and end time
                # Duplicate issue has been prevented in the frontend
                task = daily_task(title ="", start_time= start_time, end_time = end_time)

                task.save()
                print(task)
                the_day.tasks.add(task)
                the_day.save()
            else:
                pass
    return HttpResponse("task made", status=status.HTTP_200_OK)


# For retrieving all user schedules involved
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_user_schedule(request):

    #Return a user schedule
    user = request.user

    serializer = DaySerializer
    qs = Day.objects.filter(user= request.user)

    # We will only return the serialized data

    s = serializer(qs, many=True)



    scheduleExists = check_if_schedule_exists(user)
    return Response({'data': s.data,'scheduleExists': scheduleExists})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def replace_user_schedule(request):
    print(request.data)

    user = request.user

    '''
    Find the day passed in and replace all existing tasks
        duplicate handled by the frontend 
    '''
    for eachDay in request.data:

        day_received = eachDay.get('which_day')
        print('day received is ', day_received)

        # Get day of the week (7 days in total)
        # Should already be created then
        the_day, created = Day.objects.get_or_create(user=user, which_day=day_received)
        the_day.save()
        '''
        Delete all the tasks for each day
        before adding tasks to it 
        '''
        the_day.tasks.all().delete()


        print("Created boolean is ", created)


        '''
        Task replacement:
             We need to iterate thru each tasks in the day
             and check make sure no overlapping time

             if nooverlapping  ->    will then add the task
        '''

        time_period_list = eachDay.get('periodArray')
        for period in time_period_list:
            print('the period is ', period)

            if period != "":
                time = period.split('-')
                start = time[0].strip()
                print('start time is ', start)
                start_time = datetime.strptime(start, '%H:%M').time()
                end = time[1].strip()
                end_time = datetime.strptime(end, '%H:%M').time()

                print('start and end time is', start, end)

                # Create a task with the start and end time
                # Duplicate issue has been prevented in the frontend
                task = daily_task(title="", start_time=start_time, end_time=end_time)

                task.save()
                print(task)
                the_day.tasks.add(task)
                the_day.save()
            else:
                pass


    return HttpResponse("task made", status=status.HTTP_200_OK)


def check_if_schedule_exists(user):
    schedule = Day.objects.filter(user=user)
    if schedule is not None:
        print("the day  is", schedule)
        return True

    else:
        return False
