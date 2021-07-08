from django.urls import path

from tutor.views import TopTutorView, TutorView
from tutor.views import TutorListView, createTutorView, tutorDeleteView,tutorEditView
from tutor.views import TutorSearchView

# from .view import TutorListView, TutorListView, TopTutorView

urlpatterns= [
    path('', TutorListView.as_view()),
    path('toptutor', TopTutorView.as_view()),
    path('delete/<str:pk>', tutorDeleteView, name="task-delete"),
    path('edit/<str:pk>', tutorEditView, name="task-edit"),
    path('<pk>', TutorView),
    path('search', TutorSearchView.as_view()),
    path('create/', createTutorView),
    ]