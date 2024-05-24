from django.urls import path
from tagscrapper.views import tag_scrap_view,get_scrap_request_status_view,get_blog_view,get_blog_small_view

urlpatterns = [
    path('tag/',tag_scrap_view),
    path('status/<int:queueid>/',get_scrap_request_status_view),
    path('blog/<str:blogid>/',get_blog_view),
    path('blogsmall/<str:blogid>/',get_blog_small_view)
    
]
