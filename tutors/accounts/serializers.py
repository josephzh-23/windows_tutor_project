from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from .models import Account



# # Here we are overwriting the save () 
class AccountSerializer(serializers.ModelSerializer):


	#These are written by us to seriazlie the 2 additional fields 
	hasFriends = serializers.SerializerMethodField('has_Friends')
	# imageUrl = serializers.SerializerMethodField('get_profileImage_Url')
	
	# A 2nd additional field for user image url 
	def has_Friends(self, user_obj):
		hasFriend = False
		return hasFriend
		
	def get_profileImage_Url(self, user_obj):
		image_Url = user_obj.profile_image.url
		return image_Url

	class Meta:
		model = Account
		fields = '__all__'

		#For extra fields 
		#extra_kwargs = {'password': {'write_only': True}}


		#For creating extra fields 
		extra_fields =  ['hasFriends', 'imageUrl']
		def get_field_names(self, declared_fields, info):
			expanded_fields = super(ToppingSerializer, self).get_field_names(declared_fields, info)
			if getattr(self.Meta, 'extra_fields', None):
				return expanded_fields + self.Meta.extra_fields
			else:
				return expanded_fields

# # class RegistrationSerializer(serializers.ModelSerializer):

# #     # not part of the model, 
# #     # password 2 kind of like an encrypted field. 
# #     password2 = serializers.CharField(style = {'input_type': 'password'},write_only= True)

# #     class Meta:
# # 		model = Account
# # 		fields = ['email', 'username', 'password', 'password2']
# # 		extra_kwargs = {
# # 				'password': {'write_only': True},
# # 		}	


# # 	def	save(self):

# # 		account = Account(
# # 					email=self.validated_data['email'],
# # 					username=self.validated_data['username']
# # 				)
# # 		password = self.validated_data['password']
# # 		password2 = self.validated_data['password2']
# # 		if password != password2:
# # 			raise serializers.ValidationError({'password': 'Passwords must match.'})
# # 		account.set_password(password)
# # 		account.save()
# # 		return account
