"""
Django settings for tutors project.

Generated by 'django-admin startproject' using Django 3.2.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

import os 
from pathlib import Path

#  This is very crucial here 
# Build paths inside the project like this: BASE_DIR / 'subdir'.
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
from django.conf import settings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/




os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tutors.settings")
os.environ['DJANGO_SETTINGS_MODULE'] = 'tutors.settings'
settings.configure()


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-cy-$z3w!!$qwtng)(%v%u#bu6b^t#_3m7zu*(6qv&t!ckwie(z'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["10.0.2.2", "localhost", "127.0.0.1"]


# Application definition

INSTALLED_APPS = [
    'channels',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
'corsheaders',
    #for the token package 
    'rest_framework.authtoken',
    'accounts',
    'tutor',
    'tutors',
    'listings', 
    'contacts',
    'Schedules',
    'notifications',
    'friend',
    'public_chat',
    'private_chat',
    'upload',
    'Util',
    'payments',
'crispy_forms'
]

MIDDLEWARE = [
      'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
  
]


# Configure for redis 

WSGI_APPLICATION = 'tutors.wsgi.application'
ASGI_APPLICATION = 'tutors.asgi.application'
#  Use channel layer in memory
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
SETTINGS_PATH = os.path.dirname(os.path.dirname(__file__))
ROOT_URLCONF = 'tutors.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(SETTINGS_PATH, 'tutors/templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres24',
        #user is basically the role name as described 
        'USER': 'developer',
        'PASSWORD': '030801',
        'HOST': 'localhost',
        'PORT': '5432'
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# # this is for connecting to the front end 
# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [os.path.join(BASE_DIR, 'build')],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages'
#             ],
#         },
#     },
# ]
# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True




# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Email settings for this backend verification

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'josephzh245@gmail.com'
EMAIL_HOST_PASSWORD = 'qcfqqdcgppexprlw'
EMAIL_USE_TLS = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

#joining for the static files 
STATIC_URL = '/static/'

# Static files (CSS, Javascript, Images)
#  Used to relocate the static file 
STATICFILES_DIRS = [
    # os.path.join(BASE_DIR, 'build/static')
     os.path.join(BASE_DIR, 'static'),
    os.path.join(BASE_DIR, 'media'),
]

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

# THis is for configuring where the images will be served
STATIC_ROOT = os.path.join(BASE_DIR, 'static_cdn')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media_cdn')



# Where pictures will be saved then 


REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [

        #For controlling user acccess

        'rest_framework.permissions.IsAuthenticated',
        #So this supports token authentaction now 
      ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    #    'rest_framework_simplejwt.authentication.JWTAuthentication',
    #    'rest_framework.permissions.AllowAny',
    ),
#     'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
#     'PAGE_SIZE':3
}


AUTH_USER_MODEL = 'accounts.Account'
CSRF_USE_SESSIONS = False
CSRF_COOKIE_HTTPONLY = False

# Redirecting the user as expected 
LOGIN_REDIRECT_URL = 'http://localhost:8000/api/chat/'

CORS_ORIGIN_WHITELIST = [

    "http://localhost:3000",

]
TEMP = os.path.join(BASE_DIR, 'media_cdn/temp')
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760 # 10mb = 10 * 1024 *1024
BASE_URL = "http://127.0.0.1:8000"

STRIPE_PUBLIC_KEY = "pk_test_51JPZJwIvBgnSRqw7iiT5nhzf1YSRVWUslcmBaYtOsLVsoxuXPpiYgCTFvIYPxKx5Da0xIT5u4539kP3N4ERbdT1c00t7yuWSkI"
STRIPE_SECRET_KEY = "sk_test_51JPZJwIvBgnSRqw7hXKQnEH310RYaEFr7sq8nucn15frevg72UKuy8sCf4oXdkT5G2ynMBmYk5w8FOHJbKrIJnOA00Js3CGUeP"
STRIPE_WEBHOOK_SECRET = ""