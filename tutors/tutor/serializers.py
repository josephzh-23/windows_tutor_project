  
from rest_framework import serializers

from accounts.models import Account
from .models import Tutor, Posting, Subject


class TutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutor
        fields = '__all__'
        # fields = ['name', 'subject', 'school', 'email', 'top_tutor', 'date_hired']


#So we get subject name and the author name
# class StringSerializer(serializers.StringRelatedField):
#     def to_internal_value(self, value):
#         return value

# Using this we can search for the tutors


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
        # fields = ['name', 'subject', 'school', 'email', 'top_tutor', 'date_hired']


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
        # fields = ['name', 'subject', 'school', 'email', 'top_tutor', 'date_hired']



#Return author and subjects in string format to the
#frontend
class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value

class PostingSerializer(serializers.ModelSerializer):

    # these 2 should match the names of the 2 serializers
    author = StringSerializer(many=False)
    subject = StringSerializer(many=True)

    class Meta:
        model = Posting
        fields = ('__all__')

        #Using the depth 1 is important here
        depth= 1