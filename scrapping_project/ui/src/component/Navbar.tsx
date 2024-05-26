import { useState } from 'react'
import './navbar.css'
import { useNavigate } from 'react-router-dom'
function BigLogo(){
    return (
        <div className="biglogo-container">
            <span style={{fontWeight:700,fontSize:"20px",color:"black"}}>Scrap</span><span style={{fontSize:"16px",color:"blue"}}>.</span><span style={{fontSize:"18px",color:"red",fontWeight:700}}>me</span>
        </div>
    )
}

function SmallLogo(){
    return (
        <div className="smalllogo-container">
            <span style={{fontWeight:700,fontSize:"14px",color:"black"}}>Scrap</span><span style={{fontSize:"10px",color:"blue"}}>.</span><span style={{fontSize:"12px",color:"red",fontWeight:700}}>me</span>
        </div>
    )
}

function Navbar({logo,profile}:{logo?:boolean,profile?:string}){
    const [ option , setOption] = useState<boolean>(false)
    return(
        <header className="navbar-container">
            { logo && <SmallLogo/> }
            
            { option && <div onClick={()=>setOption(false)} className='full-overlay'></div> }
            { profile && <Profile option={option} setOption={setOption} name={profile}/>}
        </header>
        
    )
}
interface ProfileProps{
    name: string
    option: boolean 
    setOption: React.Dispatch<React.SetStateAction<boolean>>
}

const base_url = import .meta.env.VITE_BASE_URL 
function Profile({name,option , setOption}:ProfileProps){
    const navigate = useNavigate();
    const handleLogout = async ()=>{
        
        const url = `${base_url}/auth/logout/`
        try{
            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    
                    'Content-Type': 'application/json', 
                    credentials:'include'
                },                
            })
            if(response.status == 200){
                navigate("/login")       
            }
        }catch{
            navigate("/login")
            
        }
    }
    return (
    <div className="profile-container">
        <div onClick={()=>setOption(true)} >
            <svg width="20" height="20" viewBox="0 0 20 20" version="1.1" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile [#1341]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-180.000000, -2159.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M134,2008.99998 C131.783496,2008.99998 129.980955,2007.20598 129.980955,2004.99998 C129.980955,2002.79398 131.783496,2000.99998 134,2000.99998 C136.216504,2000.99998 138.019045,2002.79398 138.019045,2004.99998 C138.019045,2007.20598 136.216504,2008.99998 134,2008.99998 M137.775893,2009.67298 C139.370449,2008.39598 140.299854,2006.33098 139.958235,2004.06998 C139.561354,2001.44698 137.368965,1999.34798 134.722423,1999.04198 C131.070116,1998.61898 127.971432,2001.44898 127.971432,2004.99998 C127.971432,2006.88998 128.851603,2008.57398 130.224107,2009.67298 C126.852128,2010.93398 124.390463,2013.89498 124.004634,2017.89098 C123.948368,2018.48198 124.411563,2018.99998 125.008391,2018.99998 C125.519814,2018.99998 125.955881,2018.61598 126.001095,2018.10898 C126.404004,2013.64598 129.837274,2010.99998 134,2010.99998 C138.162726,2010.99998 141.595996,2013.64598 141.998905,2018.10898 C142.044119,2018.61598 142.480186,2018.99998 142.991609,2018.99998 C143.588437,2018.99998 144.051632,2018.48198 143.995366,2017.89098 C143.609537,2013.89498 141.147872,2010.93398 137.775893,2009.67298" id="profile-[#1341]"> </path> </g> </g> </g> </g></svg>
            <span>{name}</span>
        </div>
        { option && 
            
        <div className='profile-options'>
            <button onClick={handleLogout}>logout</button>
        </div>
         }
        
    </div>)
}
export {Navbar,BigLogo}