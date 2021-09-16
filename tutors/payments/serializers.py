from rest_framework import serializers

from payments.models import Appointment


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['title', 'start_time', 'end_time']
        # fields = ['name', 'subject', 'school', 'email', 'top_tutor', 'date_hired']

