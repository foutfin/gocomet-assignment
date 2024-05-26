// import { Navbar } from "../component/Navbar"
import { useEffect, useState } from "react"
import "./historypage.css"
import { getHistory } from "../api"
import { Link } from "react-router-dom"


function HistoryPage(){
    // const navigate = useNavigate()
    const [loading , setLoading] = useState<boolean>(true)
    // const [user , setUser ] = useState<string>("")
    // const [accountLoading , setAccountLoading] = useState<boolean>(true)
    const [tags , setTags ] = useState<Array<string> | null>([])

    useEffect(()=>{
        document.title = `history`;
        (async () =>{

            // const user = await getAccountInfo()
            // if(!user){
            //     navigate("/login")
            //     return
            // }
            // setUser(user)
            // setAccountLoading(false)
            const history = await getHistory()
            setTags(history)
            setLoading(false)
        })()
    },[])

    return(
        <div className="historypage-container">
            <h1>Search Results</h1>
            {loading ? 
                <div style={{marginInline:"auto",marginTop:"200px"}} className="loader"></div>
            :
            
                tags == null || tags.length == 0?
                <p>Nothing Found</p>
                :
                <div className="histroy-tags-container">
                    {tags.map(t=><Tag key={t} tag={t}/>)}
                </div>
                
            
            }
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

export default HistoryPage


  
        /* <Navbar logo={true} profile={user}/>
        { accountLoading ? <div style={{marginInline:"auto",marginTop:"200px"}} className="loader"></div> 
            :
            <div className="historypage-container">
            <h1>Search Results</h1>
            {loading ? 
                <div style={{marginInline:"auto",marginTop:"200px"}} className="loader"></div>
            :
            
                tags == null || tags.length == 0?
                <p>Nothing Found</p>
                :
                <div className="histroy-tags-container">
                    {tags.map(t=><Tag key={t} tag={t}/>)}
                </div>
                
            
            }
        </div>
        } */