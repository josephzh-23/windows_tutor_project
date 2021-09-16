from tempfile import NamedTemporaryFile

from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, ListView, CreateView
from django.core.files.storage import FileSystemStorage
from django.urls import reverse_lazy

from .forms import BookForm
from .models import Book


class Home(TemplateView):
    template_name = 'home.html'


#Used to handle the upload function from android
@csrf_exempt
def android_image_upload(request):
    context = {}

    print("message came throught here")
    if request.method == 'POST':

        # Try to save the img coming in from android
        print(request.body)

        # Using just simply a response
        uploaded_file = request.body
        # How you normally get the file out of the body
        # For a multi part request

        #Write jpg file to the temp file

        print(request.FILES)
        img_temp = NamedTemporaryFile(delete=True)
        img_temp.write(request.body)
        fs = FileSystemStorage()


        print("file type is", type(uploaded_file))
        # First get type of the file passed in here
        name = fs.save("joseph", img_temp)


        #The original part
        # uploaded_file = request.FILES['body']
        # fs = FileSystemStorage()
        #
        # name = fs.save("joseph", uploaded_file)

        # name = fs.save(uploaded_file.name, uploaded_file)
        # context['url'] = fs.url(name)
    return render(request, 'upload.html', context)


#Regular upload
def upload(request):
    context = {}
    if request.method == 'POST':
        uploaded_file = request.FILES['document']
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        context['url'] = fs.url(name)
    return render(request, 'upload.html', context)



#Shows all the books lists
def book_list(request):
    books = Book.objects.all()
    return render(request, 'book_list.html', {
        'books': books
    })


def upload_book(request):
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('book_list')
    else:
        form = BookForm()
    return render(request, 'upload_book.html', {
        'form': form
    })


def delete_book(request, pk):
    if request.method == 'POST':
        book = Book.objects.get(pk=pk)
        book.delete()
    return redirect('book_list')


class BookListView(ListView):
    model = Book
    template_name = 'class_book_list.html'
    context_object_name = 'books'


class UploadBookView(CreateView):
    model = Book
    form_class = BookForm
    success_url = reverse_lazy('class_book_list')
    template_name = 'upload_book.html'