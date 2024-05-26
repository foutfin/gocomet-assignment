import { useState } from "react"
import { Navbar } from "../component/Navbar"
import "./login.css"
import { useNavigate } from "react-router-dom";

const base_url = import .meta.env.VITE_BASE_URL 

enum LogInStates{
    nothing,
    failed,
    notauthorized,
    empty
}

function LogIn(){
    const navigate = useNavigate();
    const [username , setUsername] = useState<string>("")
    const [password , setPassword] = useState<string>("")
    const [ state , setState ] = useState<LogInStates>(LogInStates.nothing)

    const handleLogin = async ()=>{
        if( !username  || !password){
            setState(LogInStates.empty)
            return
        }
        const url = `${base_url}/auth/login/`
        try{
            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    
                    'Content-Type': 'application/json', 
                    credentials:'include'
                },
                
                body: JSON.stringify({username: username, password: password})
            })
            if(response.status == 200){
                const data = await response.json()
                if( data.hasOwnProperty("error")){
                    setState(LogInStates.notauthorized)
                }else{
                    navigate("/")
                }
                    
            }else{
                setState(LogInStates.failed)
            }
        }catch{
            setState(LogInStates.failed)
            
        }
    }
    return (
        <div>
            <Navbar logo={true} />
            <div className="login-container">
                <div className="input-fields-container">
                    <div className="input-field">
                        <label htmlFor="username" >UserName</label>
                        
                        <input value={username} onChange={(e)=>setUsername(e.target.value)} id="username" type="text" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password" >Password</label>
                        
                        <input value={password} onChange={(e)=>setPassword(e.target.value)} id="password" type="password" />
                    </div>
                </div>
                <div className="login-bottom">
                { state == LogInStates.failed && <span className="msg">Somethign Went Wronge</span>}
                { state == LogInStates.empty && <span className="msg">Fields are empty</span>}
                { state == LogInStates.notauthorized && <span className="msg">authorization failed</span>}
                <button onClick={handleLogin} className="input-button">Login</button>
                <button onClick={()=>navigate("/signup")} className="input-button">SignUp</button>
                </div>
            </div>
            
        </div>
    )
}
export default LogIn