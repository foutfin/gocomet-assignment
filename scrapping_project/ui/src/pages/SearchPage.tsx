import {  useEffect, useState } from "react"
import "./searchpage.css"
// import { Navbar } from "../component/Navbar"
import { Data } from "../types"
import Result from "../component/Result"
import Search from "../component/Search"

function SearchPage(){
    const [isResultView , setResultView] = useState<boolean>(false)
    const [tag , setTag] = useState<string>("")
    const [result , setReult] = useState<Data>({blogs:[],pageInfo:{hasNextPage:false,endCursor:""}})
   

    useEffect(()=>{
        document.title = 'Search tag';
    },[])
    

    return(
    <div>
        { isResultView ?
            
            <>
                <Result tag={tag} setResultView={setResultView} result={result}/>
            </>
            :
            <>
                 <Search setTag={setTag} setReult={setReult} setResultView={setResultView} />
            </>
        }
    </div>
    )
}

export default SearchPage;
