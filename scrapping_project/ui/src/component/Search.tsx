import { SearchError } from "../enum"
import {  useState } from "react"
import './search.css'
import { SearchProp } from "../types"
import { BigLogo } from "./Navbar"
 

const base_url = import .meta.env.VITE_BASE_URL 

function Search({setTag,setReult,setResultView}:SearchProp){
    const [ search , setSearch] = useState<string>()
    const [loading , setLoading] = useState<boolean>(false)
    const [error , setError] = useState<SearchError>(SearchError.noerror)

    const handleScrap = async () => {
        if (!search){
            return
        }
        setLoading(true)
        try{
            const url = `${base_url}/tag/`
            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',               
                },
                body: JSON.stringify({tag: search, after: ''})
            })
            if(response.status == 200){
                const data = await response.json()
                if(data.blogs.length == 0){
                    setError(SearchError.nothingfound)
                }else{
                    setReult(data)
                    setTag(search)
                    setResultView(true)
                }
            }else{
                setError(SearchError.failed)
            }
            
        }catch{
            setError(SearchError.failed)
        }
        setLoading(false)
        
    }

    const handleKeyDown = (event:React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleScrap()
        }
      }

    return (
    <div className="search-container">
        <BigLogo/>
        <div className="searchbox-container">
            <svg  preserveAspectRatio="xMidYMid meet" className="searchbox-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            <input onKeyDown={handleKeyDown} value={search} onChange={e=>setSearch(e.target.value)} className="searchbox" type="text" />
        </div>
        { loading ?
            <div className="loader"></div>
            :<div className="search-info-container">
                { error == SearchError.failed && <span>Something Went Wronge</span> }
                { error == SearchError.nothingfound && <span>No Result Found</span> }
                <button onClick={handleScrap} className="scrap-button">Scrap</button>
            </div>
            
        }
        
    </div>

    )
}
export default Search