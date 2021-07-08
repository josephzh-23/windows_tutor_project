  
from rest_framework import serializers
from .models import Tutor

class TutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutor
        fields = '__all__'
        # fields = ['name', 'subject', 'school', 'email', 'top_tutor', 'date_hired']
    
