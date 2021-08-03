import json
from datetime import timezone, datetime

from django.db.models import Q
from rest_framework import permissions, viewsets
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


from rest_framework.status import HTTP_404_NOT_FOUND
from rest_framework.views import APIView

from accounts.models import Account
from listings.serializer import ListingSerializer
from .models import Tutor, Subject, Posting
from .serializers import TutorSerializer, PostingSerializer, SubjectSerializer

# Have a section for the tutors here
# Create your views here.



SUCCESS = 'success'
ERROR = 'error'
DELETE_SUCCESS = 'deleted'
UPDATE_SUCCESS = 'updated'
CREATE_SUCCESS = 'created'
class TutorListView(ListAPIView):
    permission_classes = (permissions.AllowAny, )
    queryset = Tutor.objects.all()

    serializer_class =TutorSerializer
    pagination_class = None

# Retireve 1 single tutor 
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def TutorView(request,pk):
    permission_classes = (permissions.AllowAny, )
    tutor = Tutor.objects.get(id=pk)
    serializer = TutorSerializer(tutor, many = False)
    return Response(serializer.data)


# Retireve 1 single tutor
@api_view(['POST',])
@permission_classes([permissions.AllowAny])
def tutorDeleteView(request,pk):
    try:
        tutor = Tutor.objects.get(id= pk)
    except Tutor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    operation = tutor.delete()
    data= {}
    if operation:
        data["success"] = "delete successful"
    else:
        data["failed"] = "delete failed"
    return Response(data= data)


#Build

# Retireve 1 single tutor 
@api_view(['DELETE',])
@permission_classes([permissions.AllowAny])
def tutorDeleteView(request,pk):
    try:
        tutor = Tutor.objects.get(id= pk)
    except Tutor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    operation = tutor.delete()
    data= {} 
    if operation:
        data["success"] = "delete successful"
    else:
        data["failed"] = "delete failed"
    return Response(data= data)


#Build

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def search_posting(request):

    print(request.data)

    qs = Posting.objects.all()
    subject = Subject.objects.all()

    title_contains_query = request.data.get('title_contains')
    id_exact_query = request.data.get('id_exact')

    title_or_author_query = request.data.get('title_or_author')

    min_hourly_rate = request.data.get('min_hourly_rate')
    max_hourly_rate = request.data.get('max_hourly_rate')

    date_min = request.data.get('date_min')
    date_max = request.data.get('date_max')
    subject = request.data.get('subject')
    reviewed = request.data.get('reviewed')
    not_reviewed = request.data.get('notReviewed')

    if is_valid_queryparam(title_contains_query):
        qs = qs.filter(title__icontains=title_contains_query)
        print(qs)
    #This checks for both the title or author query here
    elif is_valid_queryparam(title_or_author_query):
        qs = qs.filter(Q(title__icontains=title_or_author_query)
                       | Q(author__name__icontains=title_or_author_query)
                       ).distinct()

    elif is_valid_queryparam(id_exact_query):
        qs = qs.filter(id=id_exact_query)

    if is_valid_queryparam(min_hourly_rate):
        qs = qs.filter(price_per_hour__gte=min_hourly_rate)
        print(qs)

    print('maximum rate is', max_hourly_rate)
    if is_valid_queryparam(max_hourly_rate):
        qs = qs.filter(price_per_hour__lt=max_hourly_rate)

    if is_valid_queryparam(date_min):
        qs = qs.filter(publish_date__gte=date_min)

    if is_valid_queryparam(date_max):
        qs = qs.filter(publish_date__lt=date_max)

#Should be able to search based on the subject
    if is_valid_queryparam(subject) and subject != 'Choose...':
        qs = qs.filter(subject__name__icontains=subject)

    # if reviewed == 'on':
    #     qs = qs.filter(reviewed=True)
    #
    # elif not_reviewed == 'on':
    #     qs = qs.filter(reviewed=False)

    print("query data is ", qs)
    serializer = PostingSerializer
    #Serializing many data here
    s = serializer(qs, many=True)

    # print(s.data)
    # posting_json_data = json.dumps(qs, indent=4, cls= PostingEncoder)
    return Response(s.data)

def is_valid_queryparam(param):
    return param != '' and param is not None

# Retireve 1 single tutor 
@api_view(['PUT',])
@permission_classes([permissions.AllowAny])
def tutorEditView(request,pk):
    try:
        tutor = Tutor.objects.get(id= pk)
    except Tutor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = TutorSerializer(tutor, data=request.data)
    data = {}
    if serializer.is_valid():
        serializer.save()
        data[SUCCESS] = UPDATE_SUCCESS
        return Response(data=data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Retrieving the top tutor 
class TopTutorView(ListAPIView):
    permission_classes= (permissions.AllowAny,)
    queryset = Tutor.objects.filter(top_tutor = True)
    serialize_class = TutorSerializer
    pagination_class = None


#Tutoring search
class TutorSearchView(APIView):  
    permission_classes = (permissions.AllowAny, )
    serializer_class = TutorSerializer

    # post a bunch of stuff
    #  the post methods, include all CRUD operations 
    #  can be done here 
    def post(self, request, format=None):
        queryset = Tutor.objects.order_by('-list_date').filter(is_published=True)
       
        # get request data here
        data = self.request.data

        
        if data.get('school') is not None: 
            school = data['school'] 
            queryset = queryset.filter(school)
            # sale_type = data['sale_type']
            # queryset = queryset.filter(sale_type__iexact=sale_type)


        if data.get('gender') is not None:
            gender = data['gender']
            queryset = queryset.filter(gender=gender)


        if data.get('pricePerHour') is not None:
            price = data['pricePerHour']
            if price == '$0+':
                price = 0
            elif price == '$20+':
                price = 20
            elif price == '$30+':
                price = 30
            elif price == '$40+':
                price = 40    
            elif price == 'Any':
                price = -1
            
            if price != -1:
                queryset = queryset.filter(price__gte=price)
        
        
        if data.get('days_listed') is not None:
                days_passed = data['days_listed']
                if days_passed == '1 or less':
                    days_passed = 1
                elif days_passed == '2 or less':
                    days_passed = 2
                elif days_passed == '5 or less':
                    days_passed = 5
                elif days_passed == '10 or less':
                    days_passed = 10
                elif days_passed == '20 or less':
                    days_passed = 20
                elif days_passed == 'Any':
                    days_passed = 0
                
                for query in queryset:
                    num_days = (datetime.now(timezone.utc) - query.list_date).days

                    if days_passed != 0:
                        if num_days > days_passed:
                            slug=query.slug
                            queryset = queryset.exclude(slug__iexact=slug)
                
        if data.get('has_photos') is not None:
            has_photos = data['has_photos']
            if has_photos == '1+':
                has_photos = 1
            elif has_photos == '3+':
                has_photos = 3
            elif has_photos == '5+':
                has_photos = 5
            elif has_photos == '10+':
                has_photos = 10
            elif has_photos == '15+':
                has_photos = 15
            
            for query in queryset:
                count = 0
                if query.photo_1:
                    count += 1
                if query.photo_2:
                    count += 1
                if query.photo_3:
                    count += 1
                if query.photo_4:
                    count += 1
                if query.photo_5:
                    count += 1
                if query.photo_6:
                    count += 1
                if query.photo_7:
                    count += 1
                if query.photo_8:
                    count += 1
                if query.photo_9:
                    count += 1
                if query.photo_10:
                    count += 1
                if query.photo_11:
                    count += 1
                if query.photo_12:
                    count += 1
                if query.photo_13:
                    count += 1
                if query.photo_14:
                    count += 1
                if query.photo_15:
                    count += 1
                if query.photo_16:
                    count += 1
                if query.photo_17:
                    count += 1
                if query.photo_18:
                    count += 1
                if query.photo_19:
                    count += 1
                if query.photo_20:
                    count += 1
                

                #  filter based on the keywords 
                if count < has_photos:
                    slug = query.slug
                    queryset = queryset.exclude(slug__iexact=slug)
            
     
                keywords = data['keywords']
                queryset = queryset.filter(description__icontains=keywords)

            #  THis make sure things returned in json format
        serializer = ListingSerializer(queryset, many=True)

        return Response(serializer.data)


@api_view(['post', ])
@permission_classes([permissions.AllowAny])
def createTutorView(request):
    #  we can also edit permission here

    print(request.data)

    # need to figure out the path here to where it's saved
    # Change the req.data.path
    serializer = TutorSerializer(data=request.data)
    data = {}
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
# @api_view(['post',])
# @permission_classes([permissions.AllowAny])
# def create_tutor_posting(request):
#     #  we can also edit permission here
#
#     print(request.body)
#     body_unicode = request.body.decode('utf-8')
#     body = json.loads(body_unicode)
#
#     print('body is ', body)
#     subject_name = body.get('subject')
#     #Find the author and subject associated based on what's passed
#
#     author = request.user
#     print('subject is', subject_name)
#
#     # subject = Subject.objects.get_or_create(subject_name )
#
#     data = request.body
#     print(body)
#     if body is not None:
#         # need to figure out the path here to where it's saved
#         #Change the req.data.path
#         serializer = PostingSerializer(author= author, subject =subject_name, data= data)
#         try:
#             if serializer.is_valid():
#
#                 serializer.save()
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#             print(serializer)
#             print(serializer.errors)
#         except Exception as e:
#             print(e)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#Handles both post and get requests
class Postings_Viewset(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = PostingSerializer

    def get_queryset(self):
        postings = Posting.objects.all()
        return postings

#For handling the post request
    def create(self, request, *args, **kwargs):
        data = request.data
        #Data here is actually
        print(request.data)
        print(data['name'])
        #Get the author as well

        # ORM : a way of writing sql query in python
        author = Account.objects.get(username =data["name"])
        for key in request.data:
            print(key)

        new_posting = Posting.objects.create(
            title=data["title"],
            body=data['body'],
            publish_date=data["publish_date"],
            author= author)
        try:
            new_posting.save()
            print(new_posting)
        except Exception as e:
            print(e)
            return Response({"error": "Sorry can't create a posting right now"})
            #Adding >1 subjects here to the posting
        for subject in data["subject"]:
            print('subject is ', subject)
            subject_added = Subject.objects.get_or_create(name=subject)
            print(subject_added)
            new_posting.subject.add(Subject.objects.get(name__iexact= subject))

        serializer = PostingSerializer(new_posting)

        return Response(serializer.data, status=status.HTTP_200_OK)



#Also want to show all the subjects
class Subjects_Viewset(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = SubjectSerializer

    def get_queryset(self):
        module = Subject.objects.all()
        return module