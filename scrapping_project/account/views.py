from django.http import JsonResponse
import json
from django.contrib.auth.models import User
from django.contrib import auth
from django.shortcuts import render

def signUp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data['username']
            password = data['password']
            re_password  = data['re_password']

            if password == re_password:
                if User.objects.filter(username=username).exists():
                    return JsonResponse({ 'error': 'user already exists','code':400 })
                else:
                    if len(password) < 8 :
                        return JsonResponse({ 'error': 'password is small','code':401 })
                    else:
                        user = User.objects.create_user(username=username, password=password)
                        return JsonResponse({ 'success': 'user created successfully','code':200 })
            else:
                return JsonResponse({ 'error': 'password does not match' })
        except:
            return JsonResponse({ 'error': 'bad request' },status=400)

        
    return JsonResponse({ 'error': 'unsupported method' },status=405)


def accountinfo_view(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({ 'error': 'not authorised' })
        try:
            return JsonResponse({ 'user':request.user.username })
        except:
            return JsonResponse({ 'error': 'Something went wrong' })
    return JsonResponse({ 'error': 'unsupported method' },status=405)

def logIn(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data['username']
            password = data['password']
        
            user = auth.authenticate(username=username, password=password)

            if user is not None:
                auth.login(request, user)
                return JsonResponse({ 'success': 'User authenticated' })
            else:
                return JsonResponse({ 'error': 'error Authenticating' })

        except:
            return JsonResponse({ 'error': 'bad request' },status=400)

    return JsonResponse({ 'error': 'unsupported method' },status=405)


def logOut(request):
    if request.method == "POST":
        try:
            auth.logout(request)
            return JsonResponse({ 'success': 'loggeed out' })
        except:
            return JsonResponse({ 'error': 'Something went wrong when logging out' })
    return JsonResponse({ 'error': 'unsupported method' },status=405)