import { Navbar } from "../component/Navbar"
import { ReactNode, useEffect, useState } from "react"

import { getAccountInfo } from "../api"
import { useNavigate } from "react-router-dom"



function ProtectedRoute({logo,children}:{logo?:boolean,children:ReactNode}){
    const navigate = useNavigate()
    const [loading , setLoading] = useState<boolean>(true)
    const [user , setUser ] = useState<string>("")

    useEffect(()=>{

        (async () =>{

            const user = await getAccountInfo()
            if(!user){
                navigate("/login")
                return
            }
            setUser(user)
            setLoading(false)
        })()
    },[])

    return(<div>
        { loading ? <div className="loader"></div>
            :
            <>
                <Navbar logo={logo} profile={user}/>
                {children}
            </>
        }     
    </div>)
}


export default ProtectedRoute