import {  useEffect, useState } from "react"
import "./searchpage.css"
import { Navbar } from "../component/Navbar"
import { Data } from "../types"
import Result from "../component/Result"
import Search from "../component/Search"


function SearchPage(){
    const [isReultView , setReultView] = useState<boolean>(false)
    const [tag , setTag] = useState<string>("")
    const [result , setReult] = useState<Data>({blogs:[],pageInfo:{hasNextPage:false,endCursor:""}})
   
    useEffect(()=>{
        document.title = 'Search tag';
    },[])

    return <div>
        { isReultView ? 
            <>
                <Navbar/>
                <Result tag={tag} setResultView={setReultView} result={result}/>
            </>
        :
            <Search setTag={setTag} setReult={setReult} setResultView={setReultView} />
        }    
    </div>
}

export default SearchPage;
