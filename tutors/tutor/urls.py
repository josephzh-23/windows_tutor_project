from django.conf.urls import url
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from tutor.views import TopTutorView, TutorView, Subjects_Viewset, Postings_Viewset, search_posting
from tutor.views import TutorListView, tutorDeleteView,tutorEditView
from tutor.views import TutorSearchView

# from .view import TutorListView, TutorListView, TopTutorView
router = DefaultRouter()
router.register("postings", Postings_Viewset, basename="student")
router.register("subjects", Subjects_Viewset, basename="module")


urlpatterns = [
    url('', include(router.urls)),
    path('search_posting', search_posting)
]
# urlpatterns= [
    # path('', TutorListView.as_view()),
    # path('toptutor', TopTutorView.as_view()),
    # path('delete/<str:pk>', tutorDeleteView, name="task-delete"),
    # path('edit/<str:pk>', tutorEditView, name="task-edit"),
    # path('<pk>', TutorView),
    # path('search', TutorSearchView.as_view()),
    # path('create_posting/', create_tutor_posting),
    # path('subjects/', Subjects_Viewset)

# ]