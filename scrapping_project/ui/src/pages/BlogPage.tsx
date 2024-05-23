import { useParams } from "react-router-dom"
import { Navbar } from "../component/Navbar"
import { useEffect, useState } from "react"
import "./blogpage.css"
import { BlogError } from "../enum"
import { BlogFull } from "../types"



const base_url = import .meta.env.VITE_BASE_URL 

function BlogPage(){
    const [loading , setLoading] = useState<boolean>(true)
    const [ blogData , setBlogData] = useState<BlogFull>()
    const [error , setError] = useState<BlogError>(BlogError.nothing)

    const {id} = useParams()
    useEffect(()=>{
        document.title = 'Scrap.me';
        async function getBlogData(){
            const url = `${base_url}/api/blog/${id}`
            try{
                const response = await fetch(url)
                if(response.status == 200){
                    const data = await response.json()
                    if( data.hasOwnProperty("error")){
                        setError(BlogError.notfound)
                    }else{
                        setBlogData(data) 
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
        <Navbar/>
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
                </div>}
            </div>
         
        }
    </div>)
}

function Tag({tag}:{tag:string}){
    return(<span className="tag">{tag}</span>)
}

export default BlogPage