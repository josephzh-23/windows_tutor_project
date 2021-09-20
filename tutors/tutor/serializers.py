  
from rest_framework import serializers

from Schedules import serializer
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



#Note here we are using special serializer for the string and the author
# Because they are special
class PostingSerializer(serializers.ModelSerializer):

    image = serializers.SerializerMethodField('get_user_image')

    # these 2 should match the names of the 2 serializers
    author = StringSerializer(many=False)
    subject = StringSerializer(many=True)

    #Add 1 more field for sending back the author's image as well


    class Meta:
        model = Posting
        fields = ('__all__')

        #Using the depth 1 is important here
        depth= 1

    # Get the user image url as well
    # Do not get the image, but the url
    def get_user_image(self, posting):
        image = posting.author.profile_image.url
        print(image)
        return image