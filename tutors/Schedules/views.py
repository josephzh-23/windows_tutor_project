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
    #Days will come in in an array
    data = request.data
    #
    day_received = data['day']
    title = data['title']
    start_time = data['start']
    end_time = data['end']

    # Parse string to time
    start_time =datetime.strptime(start_time, '%H:%M:%S').time()
    end_time = datetime.strptime(end_time, '%H:%M:%S').time()
    #Get day of the week
    #Create a day with the user, if not exists
    #
    print(start_time)
    the_day, created = Day.objects.get_or_create(user = user,which_day= day_received)
    the_day.save()
    print("Created boolean is ", created)
    print("When already created boolean is ", created)
    '''
    We need to iterate thru each tasks in the day
    and check make sure no overlapping time
    
    if nooverlapping  ->    will then add the task
    '''

    #If created for the frist time
    if created == True:


        task = daily_task(title =title, start_time=start_time,end_time= end_time)
        task.save()
        the_day.tasks.add(task)
        the_day.save()
        print(the_day.tasks.all())
        res = {}

    # If day already exists for a user
    #Make sure there is no duplicate task
    else:
        for task in the_day.tasks.all():
                print("Checking if duplicate")
                overlap = task.check_no_overlap_task(start_time=start_time,end_time = end_time)

                # No overlap
                if overlap ==-1:
                    print("no duplicate is found")
                    #Create a task with the start and end time
                    task = daily_task(title =title, start_time= start_time, end_time = end_time)
                    task.save()
                    the_day.tasks.add(task)
                    the_day.save()
                    print(task)

                    return HttpResponse("task created", status = status.HTTP_200_OK)

                #If overlap
                else:
                    print("A duplicate is found already")
                    data['error'] = "This new task overlaps with existing task"
                    return HttpResponse(content="task made", status=status.HTTP_400_BAD_REQUEST)

    #Check if the query set is empty or not
    # if day_by_user.tasks.all().exists():
    #
    #     for task in day_by_user.tasks.all():
    #
    #         overlap = task.check_no_overlap_task(start_time=start_time,end_time = end_time)
    #
    #         # No overlap
    #         if overlap ==1:
    #             #Create a task with the start and end time
    #             task = daily_task(title, start_time, end_time)
    #             day_by_user.tasks.add(task)
    #             day_by_user.save()
    #             print(task)
    #
    #             return HttpResponse("task created", status = status.HTTP_200_OK)
    #
    #         #If overlap
    #         else:
    #             data['error'] = "This new task overlaps with existing task"
    #             return HttpResponse(content="task made", status=status.HTTP_400_BAD_REQUEST)

    #If no tasks exists yet, create a new task and then save it
    # else:
    #     # Create a task with the start and end time
    #     task = daily_task(title, start_time, end_time)
    #     print("joseph")
    #     day_by_user.tasks.add(task)
    #     day_by_user.save()
    #     print(task)
    #     return HttpResponse(  "task made", status = status.HTTP_200_OK)

    return HttpResponse("task made", status=status.HTTP_200_OK)


#Handles the get request for returning schedule views
# class Schedule_Viewset(viewsets.ModelViewSet):
#     permission_classes = [AllowAny]
#
#     serializer_class =DaySerializer
#
#     def get_queryset(self):
#         postings = Day.objects.all()
#         return postings

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_user_schedule(request):

    #Return a user schedule

    serializer = DaySerializer
    qs = Day.objects.filter(user= request.user)

    # We will only return the serialized data

    s = serializer(qs, many=True)

    # data = {}
    # data['res'] = s.data
    return Response(s.data)