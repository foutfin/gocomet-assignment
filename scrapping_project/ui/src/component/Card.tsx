import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import './card.css'
import  {BlogSmall  } from "../types"
import  { cardStatus } from "../enum"
import { SuccessState,FailedState,CrawlingState,PendingState } from "./States"

const base_url = import .meta.env.VITE_BASE_URL 

function Card({id,title,queue_id}:{id:string,title:string,queue_id:number}){
    const [status , setStatus] = useState<cardStatus>(cardStatus.pending)
    const [ blogData , setBlogData] = useState<BlogSmall>()
    const start = useRef(Date.now())
    const end = useRef(Date.now())

    async function getBlogData(){
        const url = `${base_url}/api/blogsmall/${id}`
            try{
                const response = await fetch(url)
                if(response.status == 200){
                    const data = await response.json()
                    if(  data.hasOwnProperty("error")){
                        setStatus(cardStatus.failed)
                    }else{
                        setBlogData(data) 
                    }
                      
                }
            }catch{
                setStatus(cardStatus.failed)
                
            }
    }

    useEffect(()=>{
        const url = `${base_url}/api/status/${queue_id}`
        let intervalId:number 
        async function tickStatus(){
            const response = await fetch(url)
            if(response.status == 200){
                const data = await response.json()
                switch(data.status) {
                    case "crawling":
                        setStatus(cardStatus.crawling)
                        break;
                    case "success":
                        setStatus(cardStatus.success)
                        clearInterval(intervalId)
                        end.current = Date.now()
                        getBlogData()
                      break;
                    case "failed":
                        setStatus(cardStatus.failed)
                        clearInterval(intervalId)
                        end.current = Date.now()
                        break;
                    case "not":
                            setStatus(cardStatus.failed)
                            clearInterval(intervalId)
                            break;
                    default:
                        setStatus(cardStatus.pending)
                  } 
                return
            }
            setStatus(cardStatus.failed)
        }
        intervalId = setInterval(tickStatus,1000)
        return ()=>{
            clearInterval(intervalId)
        }
    },[])

    return (
    <div className="card-container">
        { status == cardStatus.success && blogData != undefined && blogData.isMemberOnly&&
                    <div className="card-membertag">
                        <svg width="16" height="16" viewBox="0 0 64 64" fill="none" ><path d="M39.64 40.83L33.87 56.7a1.99 1.99 0 0 1-3.74 0l-5.77-15.87a2.02 2.02 0 0 0-1.2-1.2L7.3 33.88a1.99 1.99 0 0 1 0-3.74l15.87-5.77a2.02 2.02 0 0 0 1.2-1.2L30.12 7.3a1.99 1.99 0 0 1 3.74 0l5.77 15.87a2.02 2.02 0 0 0 1.2 1.2l15.86 5.76a1.99 1.99 0 0 1 0 3.74l-15.87 5.77a2.02 2.02 0 0 0-1.2 1.2z" fill="#FFC017"></path></svg>
                        <span>Member Only</span>
                    </div>}
        <span className="card-title">{title}</span>
        {   status == cardStatus.success && 
            <Link className="card-link" to={`/blog/${id}`} target="_blank" rel="noopener noreferrer" > 
                Go to Blog
            </Link>
        }
        <div>
            <div>
            { status == cardStatus.success && blogData != undefined && 
            <div className="card-detail-conatiner">
                <img src={blogData.creator.img} />
                        <div>
                            <span className="card-creator-name">{blogData.creator.name}</span>
                            <span className="card-blog-detail">{blogData.detail}</span>
                        </div>
                </div>}
                
                
            </div>
            <div className="card-status-container">
            { status == cardStatus.pending && <PendingState/> }
                    { status == cardStatus.success && <SuccessState/> }
                    { status == cardStatus.crawling && <CrawlingState/> }
                    { status == cardStatus.failed && <FailedState/> }
                    { (status == cardStatus.success || status == cardStatus.failed)  && <span style={{fontSize:"12px",marginLeft:"3px" }}>{Math.floor((end.current -start.current)/1000)} s</span> } 
            </div>
        </div>

    </div>)
}

export default Card