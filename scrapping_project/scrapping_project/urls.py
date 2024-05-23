from django.urls import path
import tagscrapper.views as view
# from tagscrapper.views import tag_scrap_view,get_scrap_request_status_view,get_blog_view,get_blog_small_view

urlpatterns = [

    path('',view.indexview),
    path('blog/<str:blogid>/',view.blogview),
    path('search/<str:tag>/', view.searchview),

    path('tag/',view.tag_scrap_view),
    path('api/status/<int:queueid>/',view.get_scrap_request_status_view),
    path('api/blog/<str:blogid>/',view.get_blog_view),
    path('api/blogsmall/<str:blogid>/',view.get_blog_small_view)
    
]
