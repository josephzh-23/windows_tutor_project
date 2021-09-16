import json
from datetime import datetime

import stripe
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views import View
from requests import Response
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework.views import APIView

from tutors import settings

User = get_user_model()
from payments.models import Appointment

# stripe.api_key = settings.STRIPE_SECRET_KEY

# Create checkout session from the product_id attached
#Here
class CreateCheckoutSessionView(View):
    def post(self, request, *args, **kwargs):
        product_id = self.kwargs["pk"]


        product = Appointment.objects.get(id=product_id)
        YOUR_DOMAIN = "http://127.0.0.1:8000"
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'unit_amount': product.price,
                        'product_data': {
                            'name': product.name,
                            # 'images': ['https://i.imgur.com/EHyR2nP.png'],
                        },
                    },
                    'quantity': 1,
                },
            ],
            metadata={
                "product_id": product.id
            },
            mode='payment',
            success_url=YOUR_DOMAIN + '/success/',
            cancel_url=YOUR_DOMAIN + '/cancel/',
        )
        return JsonResponse({
            'id': checkout_session.id
        })

# get user appointment (all appointments user has
# made) based on user id


def get_user_appointment(request):
    sender = request.user

    #todo: will need to change later on

    # Need to work on notifications and stuff like
    # student and tutor relation -> studentList and tutorList
    receiver = User.objects.get(id =1)
    appointment, created= Appointment.objects.get_or_create(sender = sender, receiver =receiver)

    return Response(appointment)


# Step 1 in the process
# @api_view(('POST',))
# This is for creating the payment intent return the client secret id
class StripeIntentView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, *args, **kwargs):



        req_json = json.loads(request.body)
        print(req_json)
        id = req_json['userId']
        print(id)
        user = User.objects.get(id = id)
        print(user)

        '''
        Here create a stripe customer
        - then create an appt based on student and tutor
        '''
        customer = stripe.Customer.create(email=user.email)

        #Here appointment equivalent to product
        #find the appointment based on the user and the id

        # product_id = self.kwargs["pk"]
        appt_id= self.kwargs["apptId"]


        appointment = Appointment.objects.get(user = user, id=appt_id)


        intent = stripe.PaymentIntent.create(
            amount=appointment.price,
            currency='usd',
            # customer=customer['id'],
            customer = customer['id'],
            metadata={
                "product_id": appointment.id
            }
        )
        print(intent)
        return JsonResponse({
            'clientSecret': intent['client_secret']
        })
    # except Exception as e:
    #     return JsonResponse({ 'error': str(e) })

@api_view(['POST'])
def createAppointment(request):
    print(request.user)
    data =request.data
    print(data)

    date = datetime.strptime(data['date'], "%m/%d/%Y")
    startTime = datetime.strptime(data['startTime'], "%H:%M").time()
    endTime = datetime.strptime(data['endTime'], "%H:%M").time()
    print(date, startTime, endTime)

    appt = Appointment()
    # date = date.date
