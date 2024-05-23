import requests
from .scrap import ScrapBlog
from tagscrapper.models import ScrapRequest
import threading

class MainScrapper:
    tag = ""
    base_url = "https://medium.com/_/graphql"
    body = [{
    "operationName": "TagArchiveFeedQuery",
    "variables": {
        "tagSlug": "",
        "timeRange": {
            "kind": "ALL_TIME"
        },
        "sortOrder": "NEWEST",
        "first": 10,
        "after": ""
    },
    "query": """
    query TagArchiveFeedQuery($tagSlug: String!, $timeRange: TagPostsTimeRange!, $sortOrder: TagPostsSortOrder!, $first: Int!, $after: String) {
        tagFromSlug(tagSlug: $tagSlug) {
            id
            sortedFeed: posts(
                timeRange: $timeRange
                sortOrder: $sortOrder
                first: $first
                after: $after
            ) {
                ...TagPosts_tagPostConnection
                __typename
            }
            __typename
        }
    }

    fragment TagPosts_tagPostConnection on TagPostConnection {
        edges {
            node {
                id
                ...StreamPostPreview_post
                __typename
            }
            __typename
        }
        pageInfo {
            hasNextPage
            endCursor
            __typename
        }
        __typename
    }

    fragment StreamPostPreview_post on Post {
        id
        ...StreamPostPreviewContent_post
        __typename
    }

    fragment StreamPostPreviewContent_post on Post {
        id
        title
        previewImage {
            id
            __typename
        }
        extendedPreviewContent {
            subtitle
            __typename
        }
        __typename
    }

 
    """
}]

    def __init__(self,tag,after="" ):
        self.tag = tag
        self.after = after

    def fetch(self,limit = 10,after = "" ):
        self.body[0]["variables"]["after"] = after
        self.body[0]["variables"]["first"] = limit
        self.body[0]["variables"]["tagSlug"] = self.tag
        res_json = requests.post(self.base_url,json= self.body).json()
        response = {
            "blogs":[],
            "pageInfo":res_json[0]["data"]["tagFromSlug"]["sortedFeed"]["pageInfo"]
        }
        blogs = []
        for r  in res_json[0]["data"]["tagFromSlug"]["sortedFeed"]["edges"]:
            blog_id = r["node"]["id"]
            title = r["node"]["title"]
            sr = ScrapRequest.objects.create(blog_id=blog_id)
            blogs.append(ScrapBlog(blog_id,title,sr.id))
            response["blogs"].append({"id":blog_id,"title":title,"queue_id":sr.id})
        
        t = threading.Thread(target=self.__scrapBlogs__, args=(blogs,))
        t.start()
        return response

    def __scrapBlogs__(self,blogs):
        for blog in blogs: 
            blog.scrap()
            print(blog.getBlogUrl())
        





    

        