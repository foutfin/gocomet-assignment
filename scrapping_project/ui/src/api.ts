const base_url = import .meta.env.VITE_BASE_URL 
const getAccountInfo = async () =>{
    const url = `${base_url}/auth/accountinfo/`
    try{
        const response = await fetch(url,{
            method: 'GET',
            credentials:'include'

        })
        if(response.status == 200){
            const data = await response.json()
            if( data.hasOwnProperty("error")){
                return null
            }else{
                return data.user
            }
               
        }else{
            return null
        }
    }catch{
        return null
    }
}

const getHistory = async () =>{
    const url = `${base_url}/api/history/`
    try{
        const response = await fetch(url,{
            method: 'GET',
            credentials:'include'

        })
        if(response.status == 200){
            const data = await response.json()
            if( data.hasOwnProperty("error")){
                return null
            }else{
                console.log(data.tags)
                return data.tags
            }
               
        }else{
            return null
        }
    }catch{
        return null
    }
}

const getSuggestion = async (tag:string) =>{
    const url = `${base_url}/api/suggestion/`
    try{
        const response = await fetch(url,{
            method: 'POST',
            credentials:'include',
            body:JSON.stringify({tag:tag})

        })
        if(response.status == 200){
            const data = await response.json()
            if( data.hasOwnProperty("error")){
                return null
            }else{
                return data.tags
            }
               
        }else{
            return null
        }
    }catch{
        return null
    }
}

const getReply = async (id:string) =>{
    const url = `${base_url}/api/reply/${id}`
    try{
        const response = await fetch(url,{
            method: 'GET',
            credentials:'include',
        })
        if(response.status == 200){
            const data = await response.json()
            if( data.hasOwnProperty("error")){
                return null
            }else{
                return data.data
            }
               
        }else{
            return null
        }
    }catch{
        return null
    }
}



export {getAccountInfo,getHistory,getSuggestion,getReply}