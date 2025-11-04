from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.

def api_home(request):
    """API home page - returns API information"""
    data = {
        'message': 'ProOmo API is running',
        'status': 'success',
        'endpoints': {
            'users': '/api/users/',
            'test': '/api/test/',
            'admin': '/admin/',
        },
        'version': '1.0'
    }
    return JsonResponse(data)

def user_list(request):
    """API endpoint for user listing"""
    data = {
        'message': 'Users API endpoint',
        'status': 'success',
        'users': [],
        'count': 0
    }
    return JsonResponse(data)

def api_test(request):
    """API test endpoint"""
    data = {
        'message': 'API test successful',
        'status': 'success',
        'method': request.method,
        'path': request.path
    }
    return JsonResponse(data)