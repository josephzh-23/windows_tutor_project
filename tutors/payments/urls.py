from django.urls import path
from payments.views import (
    CreateCheckoutSessionView, get_user_appointment)


urlpatterns = [
    path('create-checkout-session/<pk>/', CreateCheckoutSessionView.as_view(), name='create-checkout-session')
    ,path('get_user_appointment/', get_user_appointment, name='create-checkout-session')

]