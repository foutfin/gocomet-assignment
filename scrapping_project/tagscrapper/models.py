from django.db import models

class Creator(models.Model):
    name = models.TextField(unique=True,null=True)
    img = models.URLField(default=None,null=True)
    

class Tag(models.Model):
    tag_name = models.TextField(unique=True)


class Blog(models.Model):
    blog_id = models.CharField(max_length=30)
    title = models.TextField()
    detail = models.CharField(max_length=255)
    blog = models.TextField()
    isMemberOnly = models.BooleanField()
    creator = models.ForeignKey(Creator , null=True,on_delete=models.SET_NULL)
    tags = models.ManyToManyField(Tag)

class RequestStaus(models.TextChoices):
    PENDING = ('pending',"Pending")
    CRAWLING = ('crawling',"Crawling")
    FAILED = ('failed',"Failed")
    SUCCESS = ('success',"Success")

class ScrapRequest(models.Model):
    blog_id = models.CharField(max_length=30)
    status = models.CharField(max_length=20,choices=RequestStaus.choices , default=RequestStaus.PENDING)


