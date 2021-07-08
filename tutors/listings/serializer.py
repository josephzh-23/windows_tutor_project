from rest_framework import serializers
from .models import Listing

class ListingSerializer(serializers.ModelSerializer):

# Returning the tutor associated 
    name = serializers.SerializerMethodField('get_username_from_tutor')
    class Meta:
        model = Listing
        fields =['slug', 'school', 'description',
        'pricePerHour', 'sex', 'list_date', 'photo_main', 'bedrooms', 
        'is_published', 'name']

    #correspond to the user model 
    def get_username_from_tutor(self, listing):
        name = listing.tutor.name
        return name

class listingDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = '__all__'
        lookup_field = 'slug'