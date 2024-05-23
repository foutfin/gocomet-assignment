import requests
from bs4 import BeautifulSoup
from tagscrapper.models import Tag , Blog,Creator,ScrapRequest,RequestStaus
from django.db.utils import IntegrityError

class ScrapBlog:
    base_url = "https://blog.medium.com"
    blog_id = ""
    title = ""
    queue_id = None

    def __init__(self,id,title,queue_id):
        self.blog_id = id
        self.title = title
        self.queue_id  = queue_id

    def getQueueId(self):
        return self.queue_id


    def getBlogUrl(self):
        return f"{self.base_url}/{self.title.replace(' ','-')}-{self.blog_id}"

    def scrap(self):
        scrap_request = ScrapRequest.objects.get(id=self.queue_id)
        if(self.__isBlogExist__(self.blog_id)):
            scrap_request.status = RequestStaus.SUCCESS
            scrap_request.save()
            return

        scrap_request.status = RequestStaus.CRAWLING
        scrap_request.save()

        res = requests.get(self.getBlogUrl())
        soup = BeautifulSoup(res.content, "html.parser")

        tags = self.__saveTag__(self.__scrapTags__(soup))
        detail = self.__scrapDetails__(soup)
        blog = self.__scrapBlog__(soup)
        isMemberOnly = self.__scrapIsMemberOnly__(soup)
        creator = self.__saveCreator__(self.__scrapAuthorName__(soup),self.__scrapAuthorImgUrl__(soup))


        b  = Blog.objects.create(
            blog_id=self.blog_id,
            title=self.title,
            detail=detail,
            blog =blog,
            isMemberOnly = isMemberOnly,
            creator=creator,
        )
        for tag in tags:
            b.tags.add(tag)
        scrap_request.status = RequestStaus.SUCCESS
        scrap_request.save()

    def __scrapBlog__(self,soup):
        output = ""
        p_tags = soup.findAll("p",{"class":"pw-post-body-paragraph"})
        for p_tag in p_tags:
            output += f"{p_tag.text}\n"
        return output

    def __isBlogExist__(self,blog_id):
        return Blog.objects.filter(blog_id=blog_id).exists()

    def __scrapIsMemberOnly__(self,soup):
        member_button = soup.find("button",{"aria-label":"Member-only story"})
        if member_button == None:
            return False
        return True
    
    def __scrapDetails__(self,soup):
        entry_div = soup.select_one("div.speechify-ignore > div.speechify-ignore")
        if entry_div == None:
            return ""
        detail_div = entry_div.select_one("div.ab.ae")
        if detail_div == None:
            return ""
        return f"{detail_div.text}"

    def __scrapTags__(self,soup):
        tags = []
        l_div = soup.select("html body div#root div.a.b.c div.l.c > div.l")

        if len(l_div) == 0:
            return tags

        for div in l_div:
            if div["class"] == ["l"]:
                ab_ca_div = div.find("div", {"class":["ab" ,"ca"]},recursive=False)
                if ab_ca_div == None:
                    return tags
                for anchor in ab_ca_div.findAll("a"):
                    tags.append(anchor.text)
        return tags

    def __scrapAuthorName__(self,soup):
        author_tag = soup.find("a",{"data-testid":"authorName"})
        return author_tag.text if author_tag else ""
    
    def __scrapAuthorImgUrl__(self,soup):
        author_img_tag = soup.find("img",{"data-testid":"authorPhoto"})
        return author_img_tag['src'] if author_img_tag else None

    def __saveTag__(self,tags):
        saved_tags = []
        for tag in tags:
            try:
                saved_tags.append(Tag.objects.create(tag_name=tag))
            except IntegrityError :
                saved_tags.append(Tag.objects.get(tag_name=tag))
        return saved_tags
    
    def __saveCreator__(self,name,imgUrl):
        try:
            return Creator.objects.create(name=name,img=imgUrl)
        except IntegrityError:
            return Creator.objects.get(name=name)

    
    def __scrapResponses__(self):
        pass



