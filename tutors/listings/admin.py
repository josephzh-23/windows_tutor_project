from django.contrib import admin

# Register your models here.
  
from django.contrib import admin
from .models import Listing

class ListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'is_published', 'description', 'pricePerHour', 'list_date', 'tutor')
    list_display_links = ('id', 'description')
    list_filter = ('tutor', )
    # list_editable = ('is_published', )
    search_fields = ('description', 'school', 'pricePerHour')
    list_per_page = 25

admin.site.register(Listing, ListingAdmin)