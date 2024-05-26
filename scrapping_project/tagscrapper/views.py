from django.http import JsonResponse
from scrapper.mainscrapper import MainScrapper
from tagscrapper.models import ScrapRequest,Blog
from django.middleware.csrf import get_token
import json
from django.shortcuts import render
from django.db.utils import IntegrityError
from tagscrapper.models import Tag ,History ,ScrapRequest,Blog

def indexview(request):
    return render(request , 'index.html')

def blogview(request,blogid):
    return render(request , 'index.html')

def searchview(request,tag):
    return render(request , 'index.html')

def tag_scrap_view(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({ 'error': 'not authorised' },status=401)
        # try:
        data = json.loads(request.body)
        tag = data['tag']
        after = "" if "after" not in data else data["after"]

        saveHistroy(request.user,tag)

        s = MainScrapper(tag)
        return JsonResponse(s.fetch(after=after),safe=False)
        # except:
        #     return JsonResponse({ 'error': 'bad request' },status=400)

    return JsonResponse({ 'error': 'unsupported method' },status=405)

def get_scrap_request_status_view(request,queueid):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({ 'error': 'not authorised' },status=401)
        try:
            try:
                b = ScrapRequest.objects.get(id=queueid)
                return JsonResponse({ "status":b.status})
            except ScrapRequest.DoesNotExist:
                return JsonResponse({ "status":"not"})
        except:
            return JsonResponse({ 'error': 'bad request' },status=400)
    return JsonResponse({ 'error': 'unsupported method' },status=405)

def get_blog_view(request,blogid):
    if request.method == "GET":
        try:
            try:
                b = Blog.objects.get(blog_id=blogid)
                return JsonResponse({ 
                    "id": b.blog_id,
                    "title": b.title,
                    "detail": b.detail,
                    "blog": b.blog,
                    "isMemberOnly": b.isMemberOnly,
                    "tags": [ tag.tag_name for tag in b.tags.all()],
                    "creator": {
                        "name" : b.creator.name,
                        "img":b.creator.img
                    },

                })
            except Blog.DoesNotExist:
                return JsonResponse({ "error":"not exist"})
        except:
            return JsonResponse({ 'error': 'bad request' },status=400)
    return JsonResponse({ 'error': 'unsupported method' },status=405)

def get_search_history_view(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({ 'error': 'not authorised' },status=401)
        try:
            try:
                history_set = History.objects.filter(user=request.user)
                searched_tags = []
                for  history in history_set:
                    searched_tags.append(history.tag.tag_name)
                
                return JsonResponse({ "tags" : searched_tags})
            except History.DoesNotExist:
                return JsonResponse({ "error":"not exist"})
        except:
            return JsonResponse({ 'error': 'bad request' },status=400)
    return JsonResponse({ 'error': 'unsupported method' },status=405)

def get_suggestion_view(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({ 'error': 'not authorised' },status=401)
        try:
            data = json.loads(request.body)
            tag = data['tag']
            try:
                history_set = History.objects.filter(user=request.user,tag__tag_name__contains=f"{tag}").order_by("-count")[:5]
                if( len(history_set) == 0 | (len(history_set)==1 and history_set[0].tag.tag_name == tag)):
                    history_set = History.objects.filter(user=request.user).order_by("-count")[:5]
                searched_tags = []
                for  history in history_set:
                    searched_tags.append(history.tag.tag_name)
                
                return JsonResponse({ "tags" : searched_tags})
            except History.DoesNotExist:
                return JsonResponse({ "error":"not exist"})
        except:
            return JsonResponse({ 'error': 'bad request' },status=400)
    return JsonResponse({ 'error': 'unsupported method' },status=405)

def get_blog_small_view(request,blogid):
    if request.method == "GET":
        try:
            try:
                b = Blog.objects.get(blog_id=blogid)
                return JsonResponse({ 
                    "id": b.blog_id,
                    "title": b.title,
                    "detail": b.detail,
                    "isMemberOnly": b.isMemberOnly,
                    "creator": {
                        "name" : b.creator.name,
                        "img":b.creator.img
                    },

                })
            except Blog.DoesNotExist:
                return JsonResponse({ "error":"not exist"})
        except:
            return JsonResponse({ 'error': 'bad request' },status=400)
    return JsonResponse({ 'error': 'unsupported method' },status=405)

def saveTag(tagname):
    try:
        return Tag.objects.create(tag_name=tagname)
    except IntegrityError :
        return Tag.objects.get(tag_name=tagname)

def saveHistroy(user,tagname):
    tag = saveTag(tagname)

    if History.objects.filter(tag = tag).exists():
        history = History.objects.get(tag = tag)
        history.count += 1
        history.save()
        return 
    History.objects.create(user=user,tag=tag,count=1)
