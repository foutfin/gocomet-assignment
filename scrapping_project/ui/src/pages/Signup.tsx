import { useState } from "react"
import { Navbar } from "../component/Navbar"
import "./login.css"
import { useNavigate } from "react-router-dom";

const base_url = import .meta.env.VITE_BASE_URL 

enum SignUpStates{
    nothing,
    failed,
    passwordnotmatch,
    passwordlengthsmall,
    success,
    alreadyexist,
    empty
}

function SignUp(){
    const navigate = useNavigate();
    const [username , setUsername] = useState<string>("")
    const [password , setPassword] = useState<string>("")
    const [repassword , setRePassword] = useState<string>("")
    const [ state , setState ] = useState<SignUpStates>(SignUpStates.nothing)

    const handleSignIn = async ()=>{
        if( !username  || !password  || !repassword){
            setState(SignUpStates.empty)
            return
        }
        if( password != repassword){
            setState(SignUpStates.passwordnotmatch)
            return
        }
        if( password.length < 8){
            setState(SignUpStates.passwordlengthsmall)
            return
        }

        const url = `${base_url}/auth/signup/`
        try{
            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    
                    'Content-Type': 'application/json', 
                    credentials:'include'
                },
                
                body: JSON.stringify({username: username, password: password,re_password:repassword})
            })
            if(response.status == 200){
                const data = await response.json()
                if( data.hasOwnProperty("error")){
                    if(data.code == 400){
                        setState(SignUpStates.alreadyexist)
                    }else if(data.code == 402){
                        setState(SignUpStates.passwordlengthsmall)
                    }
                    
                }else{
                    setState(SignUpStates.success)
                }
                    
            }else{
                setState(SignUpStates.failed)
            }
        }catch{
            setState(SignUpStates.failed)
            
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
                    <div className="input-field">
                        <label htmlFor="password" >Re-Password</label>
                        
                        <input value={repassword} onChange={(e)=>setRePassword(e.target.value)} id="password" type="password" />
                    </div>
                </div>
                <div className="login-bottom">
                { state == SignUpStates.failed && <span className="msg">Somethign Went Wronge</span>}
                { state == SignUpStates.empty && <span className="msg">Fields are empty</span>}
                { state == SignUpStates.success && <span className="msg">SignUp successful. LogIn now</span>}
                { state == SignUpStates.passwordnotmatch && <span className="msg">Password and Re-password not matching</span>}
                { state == SignUpStates.passwordlengthsmall && <span className="msg">Password Length should be equal or greater than 8</span>}
                { state == SignUpStates.alreadyexist && <span className="msg">User Already Exist</span>}
                <button onClick={handleSignIn} className="input-button">SignUp</button>
                <button onClick={()=>navigate("/login")} className="input-button">Login</button>
                </div>
            </div>
            
        </div>
    )
}
export default SignUp