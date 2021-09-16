from datetime import datetime, timedelta, timezone

from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Listing
from .serializer import ListingSerializer, listingDetailSerializer

SUCCESS = 'success'
ERROR = 'error'
DELETE_SUCCESS = 'deleted'
UPDATE_SUCCESS = 'updated'
CREATE_SUCCESS = 'created'

# will also return the username as well 
class ListingsAllView(ListAPIView):
    queryset = Listing.objects.order_by('-list_date')
    permission_classes = (permissions.AllowAny, )
    serializer_class = ListingSerializer
    lookup_field = 'slug'


# Retireve 1 single tutor 
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def ListingView(request,pk):
    permission_classes = (permissions.AllowAny, )
    tutor_listing = Listing.objects.get(id=pk)

    serializer = ListingSerializer(tutor_listing, many = False)
    return Response(serializer.data)


#  Note here we need token permission for this
#  does not have the permission allow any 
# class ListingView(RetrieveAPIView):
#     queryset = Listing.objects.order_by('-list_date').filter(is_published=True)
#     serializer_class = listingDetailSerializer
#     lookup_field = 'slug'


class ArticleViewSet(APIView):

    @csrf_exempt
    def post(self, request, *args, **kwargs):

        return Response(ok)



class SearchView(APIView):
    permission_classes = (permissions.AllowAny, )
    serializer_class = ListingSerializer

    # post a bunch of stuff
    #  the post methods, include all CRUD operations 
    #  can be done here 
    def post(self, request, format=None):
        queryset = Listing.objects.order_by('-list_date').filter(is_published=True)
       
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
        
        
        if data.get('bedroom') is not None:    
            bedrooms = data['bedrooms']
            if bedrooms == '0+':
                bedrooms = 0
            elif bedrooms == '1+':
                bedrooms = 1
            elif bedrooms == '2+':
                bedrooms = 2
            elif bedrooms == '3+':
                bedrooms = 3
            elif bedrooms == '4+':
                bedrooms = 4
            elif bedrooms == '5+':
                bedrooms = 5
            
            queryset = queryset.filter(bedrooms__gte=bedrooms)


        if data.get('home_type') is not None:
            home_type = data['home_type']
            queryset = queryset.filter(home_type__iexact=home_type)

            bathrooms = data['bathrooms']
            if bathrooms == '0+':
                bathrooms = 0.0
            elif bathrooms == '1+':
                bathrooms = 1.0
            elif bathrooms == '2+':
                bathrooms = 2.0
            elif bathrooms == '3+':
                bathrooms = 3.0
            elif bathrooms == '4+':
                bathrooms = 4.0
            
            queryset = queryset.filter(bathrooms__gte=bathrooms)

        
        if data.get('sqft') is not None:
            sqft = data['sqft']
            if sqft == '1000+':
                sqft = 1000
            elif sqft == '1200+':
                sqft = 1200
            elif sqft == '1500+':
                sqft = 1500
            elif sqft == '2000+':
                sqft = 2000
            elif sqft == 'Any':
                sqft = 0
            
            if sqft != 0:
                queryset = queryset.filter(sqft__gte=sqft)
            

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
            
        if data.get('open_house') is not None:
            open_house = data['open_house']
            queryset = queryset.filter(open_house__iexact=open_house)

        if data.get('keywords') is not None:
                keywords = data['keywords']
                queryset = queryset.filter(description__icontains=keywords)

            #  THis make sure things returned in json format
        serializer = ListingSerializer(queryset, many=True)

        return Response(serializer.data)


@api_view(['post',])
@permission_classes((IsAuthenticated,))
def createListingView(request):
    #  we can also edit permission here 

    # user comes from the token 
    user = request.user

    print(user)
    print(request.data)
    tutor = Listing(tutor = request.user)
    
    serializer = ListingSerializer(tutor, data =request.data)
    data = {}
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Retireve 1 single tutor 
# have to make sure this works 
@api_view(['Post',])
@permission_classes((permissions.IsAuthenticated,))
def editListingView(request,pk):
    
    print(request.user)
    listings = Listing.objects.filter(tutor = request.user,
    id = pk)
    for listing in listings:
        print(listing)
        if not listing:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            serializer = ListingSerializer(listing, data=request.data)
            data = {}
            if serializer.is_valid():
                serializer.save()
                data[SUCCESS] = UPDATE_SUCCESS
                return Response(data=data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# Retireve 1 single tutor 
@api_view(['DELETE',])
@permission_classes([permissions.AllowAny])
def deleteListingView(request,pk):
    try:
        listing = Listing.objects.get(id= pk)
    except listing.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    operation = listing.delete()
    data= {} 
    if operation:
        data["success"] = "delete successful"
    else:
        data["failed"] = "delete failed"
    return Response(data= data)

