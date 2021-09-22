from django.urls import path
from payments.views import (
    CreateCheckoutSessionView, get_user_appointment, StripeIntentView, createAppointment)


urlpatterns = [
    path('create-checkout-session/<pk>/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('get_user_appointment/', get_user_appointment, name='create-checkout-session'),

    # path('payment-intent/', StripeIntentView.as_view(), name = 'payment-intent'),
    path('create-appointment/',createAppointment , name='payment-intent'),

    path('create-payment-intent/<pk>/', StripeIntentView.as_view(), name='create-payment-intent'),

]