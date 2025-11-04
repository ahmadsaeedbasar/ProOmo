from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect

def api_home(request):
    """Simple API home page - redirects to frontend"""
    return HttpResponseRedirect('http://localhost:3000')

urlpatterns = [
    path('', api_home, name='api_home'),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')), # Include our users app URLs
]