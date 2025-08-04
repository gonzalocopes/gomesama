"""
Django settings for gomesama_backend project.
"""

from pathlib import Path
import os
import dj_database_url  # Para la base de datos en Render

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    'django-insecure-796(v2csw_rr1sbh9!1&^un-5neg1^+3v1e@sh*q58=&(hr1^t'
)

DEBUG = os.environ.get("DEBUG", "True") == "True"

# ===========================
# ALLOWED HOSTS
# ===========================
ALLOWED_HOSTS = ["*"]  # Render y dominio futuro

# ===========================
# APPS
# ===========================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Apps propias
    'productos',

    # API
    'rest_framework',

    # CORS
    'corsheaders',
]

# ===========================
# MIDDLEWARE
# ===========================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS primero
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Para archivos estáticos
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ===========================
# CORS (permitir React)
# ===========================
CORS_ALLOW_ALL_ORIGINS = True  # Para desarrollo, luego se puede restringir

# ===========================
# URLS
# ===========================
ROOT_URLCONF = 'gomesama_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'gomesama_backend.wsgi.application'

# ===========================
# DATABASE
# ===========================
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
        ssl_require=False
    )
}

# ===========================
# PASSWORDS
# ===========================
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

# ===========================
# LANGUAGE & TIMEZONE
# ===========================
LANGUAGE_CODE = 'es-ar'
TIME_ZONE = 'America/Argentina/Buenos_Aires'
USE_I18N = True
USE_TZ = True

# ===========================
# STATIC & MEDIA FILES
# ===========================
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Para Render
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
