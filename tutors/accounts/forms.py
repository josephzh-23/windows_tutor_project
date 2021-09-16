
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate

from accounts.models import Account

# Used mainly for validation here
class RegistrationForm(UserCreationForm):
    email = forms.EmailField(max_length=254, help_text='Required. Add a valid email address.')

    # This shows all the fields required in this form 
    class Meta:
        model = Account
        fields = ('email', 'username', 'password1', 'password2', )

    # This will validate the email that is submitted, and then we clean this and then 

    def clean_email(self):
        email = self.cleaned_data['email'].lower()

        # Check to see if email alreay exists 
        try:
            account = Account.objects.exclude(pk=self.instance.pk).get(email=email)
        except Account.DoesNotExist:
            return email
        raise forms.ValidationError('Email "%s" is already in use.' % account)

    def clean_username(self):
        username = self.cleaned_data['username']
        try:
            account = Account.objects.exclude(pk=self.instance.pk).get(username=username)
        except Account.DoesNotExist:
            return username
        raise forms.ValidationError('Username "%s" is already in use.' % username)


# Use a login form authenticator

class AccountAuthenticationForm(forms.ModelForm):

    #widget here : the password will be hidden 
    # password = forms.CharField(label='Password', widget=forms.PasswordInput)

    class Meta:
        model = Account
        fields = ('email', 'password')

    #Another way of cleaning data 
    def clean(self):
        if self.is_valid():
            email = self.cleaned_data['email']
            password = self.cleaned_data['password']

            #has to be either error for 'email' or 'password'
            if not authenticate(email=email, password=password):
                raise forms.ValidationError({"password":"Please check your email and password"})
    
    def save(self):
        # Can also place this in the save() in the forms.py 
        if form.is_valid():
            email = request.POST['email']
            password = request.POST['password']
            user = authenticate(email=email, password=password)

            if user:
                login(request, user)
    

class AccountUpdateForm(forms.ModelForm):

    class Meta:
        model = Account
        fields = ('username', 'email', 'profile_image', 'hide_email' )

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        try:
            account = Account.objects.exclude(pk=self.instance.pk).get(email=email)
        except Account.DoesNotExist:
            return email
        raise forms.ValidationError('Email "%s" is already in use.' % account)

    def clean_username(self):
        username = self.cleaned_data['username']
        try:
            account = Account.objects.exclude(pk=self.instance.pk).get(username=username)
        except Account.DoesNotExist:
            return username
        raise forms.ValidationError('Username "%s" is already in use.' % username)


    # Commit = true because we want to commit these changes 
    # commit = false not committing changes to db 
    def save(self, commit=True):
        account = super(AccountUpdateForm, self).save(commit=False)

        account.username = self.cleaned_data['username']
        account.email = self.cleaned_data['email'].lower()
        
        account.profile_image = self.cleaned_data['profile_image']
        account.hide_email = self.cleaned_data['hide_email']
        
        print("data updated")
        if commit:
            account.save()
        return account

