import { useNavigate, useParams } from "react-router-dom"
import Result from "../component/Result"
import { useEffect, useState } from "react"
import { Navbar } from "../component/Navbar"
import { getAccountInfo } from "../api"

function ResultPage(){
    const {tag} = useParams()
    const navigate = useNavigate()
    const [user , setUser ] = useState<string>("")
    const [loading , setLoading] = useState<boolean>(true)

    useEffect(()=>{
        async function accountInfo(){

            const user = await getAccountInfo()
            if(!user){
                navigate("/login")
                return
            }
            setUser(user)
            setLoading(false)
        }
        accountInfo()
    },[])

    return(
        <>
        { loading ? <div className="loader"></div> :
            <>
                <Navbar logo={true} profile={user} />
                {
                    tag ?
                    <Result tag={tag}/>
                    :
                    <p> Tag Not Supplied</p>
                }
            </>
        }
            
        </>
        
    ) 
}
export default ResultPage