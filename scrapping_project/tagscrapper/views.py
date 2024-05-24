from django.http import JsonResponse
from scrap.mainscrapper import MainScrapper
from scrapper.models import ScrapRequest,Blog
from django.middleware.csrf import get_token
import json

def tag_scrap_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            tag = data['tag']
            after = "" if "after" not in data else data["after"]
            s = MainScrapper(tag)
            return JsonResponse(s.fetch(after=after),safe=False)
        except:
            return JsonResponse({ 'error': 'bad request' },status=400)

    return JsonResponse({ 'error': 'unsupported method' },status=405)

def get_scrap_request_status_view(request,queueid):
    if request.method == "GET":
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
