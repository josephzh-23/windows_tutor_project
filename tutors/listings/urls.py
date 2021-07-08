from django.urls import path
from .views import ListingView, ListingsAllView, SearchView, ArticleViewSet, createListingView
from .views import editListingView

urlpatterns = [
    path('', ListingsAllView.as_view()),
     path('<pk>', ListingView),
    path('search', SearchView.as_view()),
    # path('<slug>', ListingView.as_view()),
    path('create/', createListingView),
      path('edit/<pk>/', editListingView),
       path('delete/<pk>/', editListingView),
]