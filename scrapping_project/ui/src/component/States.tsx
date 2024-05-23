function PendingState(){
    return(
        <>
        <svg className="card-status-icon" preserveAspectRatio="x0Y0 meet" viewBox="0 0 850 850"  version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M511.9 183c-181.8 0-329.1 147.4-329.1 329.1s147.4 329.1 329.1 329.1c181.8 0 329.1-147.4 329.1-329.1S693.6 183 511.9 183z m0 585.2c-141.2 0-256-114.8-256-256s114.8-256 256-256 256 114.8 256 256-114.9 256-256 256z" fill="#0F1F3C"></path><path d="M548.6 365.7h-73.2v161.4l120.5 120.5 51.7-51.7-99-99z" fill="#0F1F3C"></path></g></svg>
                    <span className="card-status-text">pending</span>
        </>
    )
}

function SuccessState(){
    return(
        <>
            <svg className="card-status-icon" preserveAspectRatio="x0Y0 meet" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#26a269" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"></path></g></svg> 
                    <span className="card-status-text">Success</span>
        </>
    )
}
function CrawlingState(){
    return(
        <>

                    <span className="card-status-text">Crawling</span>
        </>
    )
}

function FailedState(){
    return(
        <>
            
                    <span className="card-status-text">Failed</span>
        </>
    )
}

export {FailedState,CrawlingState,SuccessState,PendingState}