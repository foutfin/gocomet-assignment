import { Link, useParams } from "react-router-dom"
import { Navbar } from "../component/Navbar"
import { useEffect, useState } from "react"
import "./blogpage.css"
import { BlogError } from "../enum"
import { BlogFull } from "../types"
import { getReply } from "../api"



const base_url = import .meta.env.VITE_BASE_URL 

interface ReplyData{
    name : string 
    img : string 
    body : string 
    last : string     
}


function BlogPage(){
    const [loading , setLoading] = useState<boolean>(true)
    const [ blogData , setBlogData] = useState<BlogFull>()
    const [error , setError] = useState<BlogError>(BlogError.nothing)
    const [replies , setReplies] = useState<Array<ReplyData>>([])
    console.log(setReplies)
    const {id} = useParams()
    useEffect(()=>{
        document.title = 'Scrap.me';
        async function getBlogData(){
            const url = `${base_url}/api/blog/${id}/`
            try{
                const response = await fetch(url)
                if(response.status == 200){
                    const data = await response.json()
                    if( data.hasOwnProperty("error")){
                        setError(BlogError.notfound)
                    }else{
                        setBlogData(data) 
                        const reply = await getReply(`${id}`)
                        console.log(reply)
                        document.title = data.title;
                    }
                      
                }
            }catch{
                setError(BlogError.failed)
                
            }
            setLoading(false)
        }
        getBlogData()
        
    },[])
    return(<div>
        <Navbar logo={true}/>
        {loading ? 
            <div style={{marginInline:"auto",marginTop:"200px"}} className="loader"></div>
        :
            <div>
                {error ==  BlogError.notfound && <p>NotFound</p>}
                {error ==  BlogError.failed && <p>Something Went Wronge</p>}
                {error ==  BlogError.nothing && blogData != undefined &&
                <div className="blog-container">
                    { blogData.isMemberOnly && 
                    <div className="blog-membertag">
                        <svg width="16" height="16" viewBox="0 0 64 64" fill="none" ><path d="M39.64 40.83L33.87 56.7a1.99 1.99 0 0 1-3.74 0l-5.77-15.87a2.02 2.02 0 0 0-1.2-1.2L7.3 33.88a1.99 1.99 0 0 1 0-3.74l15.87-5.77a2.02 2.02 0 0 0 1.2-1.2L30.12 7.3a1.99 1.99 0 0 1 3.74 0l5.77 15.87a2.02 2.02 0 0 0 1.2 1.2l15.86 5.76a1.99 1.99 0 0 1 0 3.74l-15.87 5.77a2.02 2.02 0 0 0-1.2 1.2z" fill="#FFC017"></path></svg>
                        <span>Member Only</span>
                    </div>}
                    <h1>{blogData.title}</h1>
                    <div className="detail-container">
                        <img src={blogData.creator.img} />
                        <div>
                            <span className="creator-name">{blogData.creator.name}</span>
                            <span className="blog-detail">{blogData.detail}</span>
                        </div>
                       
                        
                    </div>
                    <div>
                        {
                            blogData.blog.split("\n").map(para => <p className="blog-blog">{para}</p>)
                        }
                            
                        </div>
                    <div className="tags-container">
                        { blogData.tags.map(tag => <Tag tag={tag}/>)}
                    </div>
                    <a href={`https://blog.medium.com/${blogData.title.replace(" ","-")}-${blogData.id}`} target="_blank" >Go To Main Medium.com blog</a>

                    <div className="reply-container">
                        { replies.length > 0 &&
                        <>
                        <h3>Responses</h3>
                        <Reply name={""} img={""} body={""} />
                        {replies.map(r => <Reply name={r.name} img={r.img} body={r.body} />)}
                        </>

                        }
                        
                    </div>
                </div>}
            </div>
         
        }
    </div>)
}

function Reply({name,img, body}:{name:string , img:string , body:string}){
    console.log(name , img,body)
    return(
        <div className="reply-container">
            <div className="replyimg-container">
                <img src={`https://miro.medium.com/v2/resize:fit:679/${img}.png`} />
                <span>{name}</span>
            </div>
            <span>{body}</span>
        </div>
    )
}

function Tag({tag}:{tag:string}){
    return(
        <Link className="card-link" to={`/search/${tag}`} target="_blank" rel="noopener noreferrer" > 
                <span className="tag">{tag}</span>
            </Link>
    )
}

export default BlogPage