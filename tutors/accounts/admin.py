from django.contrib import admin

# Register your models here.



#For


from django.contrib import admin

from .models import Account, Subject, Posting

admin.site.register(Account)
admin.site.register(Subject)
admin.site.register(Posting)