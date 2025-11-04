from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_home, name='api_home'),
    path('users/', views.user_list, name='user_list'),
    path('test/', views.api_test, name='api_test'),
]