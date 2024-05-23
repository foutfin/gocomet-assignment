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

function Navbar(){
    return(
        <header className="navbar-container">
            <SmallLogo/>
        </header>
        
    )
}
export {Navbar,BigLogo}