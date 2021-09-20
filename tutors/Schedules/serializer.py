from rest_framework import serializers

from Schedules.models import Day, daily_task





class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = daily_task
        fields = ['title', 'start_time', 'end_time']
        # fields = ['name', 'subject', 'school', 'email', 'top_tutor', 'date_hired']


#Return author and subjects in string format to the
#frontend
class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value

class DaySerializer(serializers.ModelSerializer):
    author = StringSerializer(many=False)
    tasks = TaskSerializer(many= True)

    class Meta:
        model = Day
        fields = ('__all__')

        #Using the depth 1 is important here
        depth= 1