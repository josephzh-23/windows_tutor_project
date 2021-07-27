from django.contrib import admin

# Register your models here.



#For


from django.contrib import admin

from .models import Account, Subject, Tutor_Posting

admin.site.register(Account)
admin.site.register(Subject)
admin.site.register(Tutor_Posting)