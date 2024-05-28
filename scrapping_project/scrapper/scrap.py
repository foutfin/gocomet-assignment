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
        
        print(blog,detail,isMemberOnly)
        
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
        url = "https://blog.medium.com/_/graphql"
        body = [{
                    "operationName": "PagedThreadedPostResponsesQuery",
                    "variables": {
                        "postId": "047ca8891eb6",
                        "postResponsesPaging": {"limit": 25,"to":""},
                        "sortType": "TOP"
                    },
                    "query": """
                    query PagedThreadedPostResponsesQuery($postId: ID!, $postResponsesPaging: PagingOptions, $sortType: ResponseSortType) {  post(id: $postId) {    id    ...CloseDiscussion_post    responsesCount    postResponses {      count      __typename    }    responseRootPost {      post {        id        __typename      }      responseDepth      __typename    }    threadedPostResponses(paging: $postResponsesPaging, sortType: $sortType) {      autoExpandedPostIds      pagingInfo {        next {          limit          to          __typename        }        __typename      }      posts {        ...PagedThreadedPostResponses_post        __typename      }      __typename    }    __typename  }}fragment CloseDiscussion_post on Post {  id  responsesLocked  isLockedResponse  __typename}fragment PagedThreadedPostResponses_post on Post {  ...StoryResponse_threadedStoryResponse_post  ...SimpleResponse_threadedSimpleResponse_post  ...SimpleResponse_threadedSimpleResponse_defaultPostResponses  ...ResponseHeader_post  __typename  id}fragment StoryResponse_threadedStoryResponse_post on Post {  id  responsesCount  postResponses {    count    __typename  }  creator {    viewerEdge {      id      isBlocking      __typename    }    ...userUrl_user    ...UserMentionTooltip_user    __typename    id  }  clapCount  previewContent {    bodyModel {      paragraphs {        text        type        __typename      }      __typename    }    __typename  }  responseDistribution  ...PostPresentationTracker_post  ...ResponseHeader_postHacky  ...ResponseQuote_post  __typename}fragment userUrl_user on User {  __typename  id  customDomainState {    live {      domain      __typename    }    __typename  }  hasSubdomain  username}fragment UserMentionTooltip_user on User {  id  name  username  bio  imageId  mediumMemberAt  membership {    tier    __typename    id  }  ...UserAvatar_user  ...UserFollowButton_user  ...useIsVerifiedBookAuthor_user  __typename}fragment UserAvatar_user on User {  __typename  id  imageId  mediumMemberAt  membership {    tier    __typename    id  }  name  username  ...userUrl_user}fragment UserFollowButton_user on User {  ...UserFollowButtonSignedIn_user  ...UserFollowButtonSignedOut_user  __typename  id}fragment UserFollowButtonSignedIn_user on User {  id  name  __typename}fragment UserFollowButtonSignedOut_user on User {  id  ...SusiClickable_user  __typename}fragment SusiClickable_user on User {  ...SusiContainer_user  __typename  id}fragment SusiContainer_user on User {  ...SignInOptions_user  ...SignUpOptions_user  __typename  id}fragment SignInOptions_user on User {  id  name  __typename}fragment SignUpOptions_user on User {  id  name  __typename}fragment useIsVerifiedBookAuthor_user on User {  verifications {    isBookAuthor    __typename  }  __typename  id}fragment PostPresentationTracker_post on Post {  id  visibility  previewContent {    isFullContent    __typename  }  collection {    id    slug    __typename  }  __typename}fragment ResponseHeader_postHacky on Post {  createdAt  creator {    id    ...UserAvatar_user    ...useIsVerifiedBookAuthor_user    viewerEdge {      id      isBlocking      __typename    }    __typename  }  mediumUrl  __typename  id}fragment ResponseQuote_post on Post {  inResponseToMediaResource {    ...ResponseQuote_mediaResource    __typename    id  }  __typename  id}fragment ResponseQuote_mediaResource on MediaResource {  href  mediumQuote {    ...ResponseQuote_quote    __typename    id  }  __typename  id}fragment ResponseQuote_quote on Quote {  quoteId  startOffset  endOffset  paragraphs {    ...TextParagraph_paragraph    __typename  }  ...buildQuotePreviewParagraph_quote  __typename  id}fragment TextParagraph_paragraph on Paragraph {  type  hasDropCap  codeBlockMetadata {    mode    lang    __typename  }  ...Markups_paragraph  ...ParagraphRefsMapContext_paragraph  __typename  id}fragment Markups_paragraph on Paragraph {  name  text  hasDropCap  dropCapImage {    ...MarkupNode_data_dropCapImage    __typename    id  }  markups {    ...Markups_markup    __typename  }  __typename  id}fragment MarkupNode_data_dropCapImage on ImageMetadata {  ...DropCap_image  __typename  id}fragment DropCap_image on ImageMetadata {  id  originalHeight  originalWidth  __typename}fragment Markups_markup on Markup {  type  start  end  href  anchorType  userId  linkMetadata {    httpStatus    __typename  }  __typename}fragment ParagraphRefsMapContext_paragraph on Paragraph {  id  name  text  __typename}fragment buildQuotePreviewParagraph_quote on Quote {  paragraphs {    id    text    type    markups {      end      start      type      __typename    }    __typename  }  startOffset  endOffset  __typename  id}fragment SimpleResponse_threadedSimpleResponse_post on Post {  id  createdAt  firstPublishedAt  latestPublishedAt  title  creator {    id    name    username    imageId    mediumMemberAt    viewerEdge {      id      isBlocking      __typename    }    ...userUrl_user    ...UserMentionTooltip_user    ...useIsVerifiedBookAuthor_user    __typename  }  clapCount  viewerEdge {    id    clapCount    __typename  }  isPublished  voterCount  responsesCount  postResponses {    count    __typename  }  allowResponses  latestRev  recommenders {    id    name    __typename  }  mediumUrl  content {    bodyModel {      ...SimpleResponseBodyModel_richText      __typename    }    __typename  }  collection {    id    slug    __typename  }  isLimitedState  inResponseToType  responseDistribution  ...PostPresentationTracker_post  ...PostScrollTracker_post  ...ResponseQuote_post  __typename}fragment SimpleResponseBodyModel_richText on RichText {  paragraphs {    ...SimpleResponseBodyModel_paragraph    __typename  }  __typename}fragment SimpleResponseBodyModel_paragraph on Paragraph {  id  name  text  type  markups {    type    start    end    href    anchorType    userId    linkMetadata {      httpStatus      __typename    }    __typename  }  __typename}fragment PostScrollTracker_post on Post {  id  collection {    id    __typename  }  sequence {    sequenceId    __typename  }  __typename}fragment SimpleResponse_threadedSimpleResponse_defaultPostResponses on Post {  responsesCount  postResponses {    count    __typename  }  threadedPostResponses(paging: {limit: 10}, sortType: $sortType) {    __typename    autoExpandedPostIds    pagingInfo {      next {        limit        to        __typename      }      __typename    }    posts {      ... on Post {        ...StoryResponse_threadedStoryResponse_post        ...SimpleResponse_threadedSimpleResponse_post        __typename        id      }      __typename    }  }  __typename  id}fragment ResponseHeader_post on Post {  __typename  id  createdAt  firstPublishedAt  latestPublishedAt  creator {    id    name    ...UserAvatar_user    ...useIsVerifiedBookAuthor_user    ...UserMentionTooltip_user    __typename  }  ...ResponsePopoverMenu_post}fragment ResponsePopoverMenu_post on Post {  id  ...ReportUserMenuItem_post  ...HideResponseMenuItem_post  ...BlockUserMenuItem_post  ...UndoClapsMenuItem_post  __typename}fragment ReportUserMenuItem_post on Post {  __typename  id  creator {    id    __typename  }  ...SusiClickable_post}fragment SusiClickable_post on Post {  id  mediumUrl  ...SusiContainer_post  __typename}fragment SusiContainer_post on Post {  id  __typename}fragment HideResponseMenuItem_post on Post {  __typename  id  collection {    id    viewerEdge {      id      isEditor      __typename    }    __typename  }  creator {    id    __typename  }}fragment BlockUserMenuItem_post on Post {  __typename  id  creator {    id    __typename  }}fragment UndoClapsMenuItem_post on Post {  id  clapCount  __typename}

                    """
        }]
        try:
            body[0]["variables"]["postId"] =  postId
            response = requests.post(url, json=body)
            d = response.json()
            posts = d[0]["data"]["post"]["threadedPostResponses"]["posts"]
            for post in posts:
                parsed = self.__parseReply__(post)
                r= Reply.objects.create(
                        reply_id=parsed["id"],
                        body = parsed["body"],
                        first_published_at = parsed["first_published_at"],
                        last_published_at = parsed["last_published_at"],
                        clap = parsed["clap"],
                        creator_name = parsed["creator_name"],
                        creator_img = parsed["creator_img"],
                        parent_reply_id =postId
                    )
                r.save()
        except:
            pass



