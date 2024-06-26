import { useEffect, useState } from "react"
import Card from "./Card"
import { Data } from "../types"
import "./result.css"
import { ResultProp } from "../types"
import { useNavigate } from "react-router-dom";

const base_url = import .meta.env.VITE_BASE_URL

function Result({tag,result,setResultView}:ResultProp){
    const navigate = useNavigate();

    const [moreBlogs , setMoreBlogs] = useState<Data>(result? result: {blogs:[],pageInfo:{hasNextPage:false,endCursor:""}})
    const [loading , setLoading] = useState<boolean>(false)
    const handleScrap = async () => {
        setLoading(true)
        const url = `${base_url}/tag/`
        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',               
              },
            body: JSON.stringify({tag: tag, after:moreBlogs.pageInfo.endCursor })
        })
        const data = await response.json()
        console.log(data)
        setMoreBlogs(p => {
            return {blogs:[...data.blogs,...p.blogs],pageInfo:data.pageInfo}
        })
        setLoading(false)
    }

    useEffect(()=>{
        document.title = `Result :- ${tag}`
        if( !result ){
            handleScrap()
        }
    },[])


    return (
    <div className="result-container">
        <h2>Searching For :- {tag}</h2>
        <div className="result-controls">
            { setResultView ?  <button onClick={()=>setResultView(false)}>back</button> :<button onClick={()=>navigate("/")}>back</button>  }
            <button onClick={handleScrap} disabled={!moreBlogs.pageInfo.hasNextPage} >Scrap Next 10</button>
        </div>
        <div className="cards-container">
            { loading ? <div style={{margin:"auto"}} className="loader"></div>:
                moreBlogs.blogs.length == 0 ? <p>No results Found </p>: moreBlogs.blogs.map(blog=><Card key={blog.id} id={blog.id} queue_id={blog.queue_id} title={blog.title}/>)
            }
           
        </div>
    </div>

    )
}

export default Result