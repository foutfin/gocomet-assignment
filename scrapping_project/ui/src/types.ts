
interface Blog{
    id:string 
    title:string
    queue_id: number
}

interface PageInfo{
    hasNextPage :boolean 
    endCursor : string
}
interface Data{
    blogs:Array<Blog>
    pageInfo:  PageInfo

}

interface BlogSmall{
    id:string 
    title : string 
    detail : string 
    isMemberOnly : boolean
    creator : Creator
}
interface Creator{
    name : string 
    img : string
}
interface SearchProp{
    setResultView : React.Dispatch<React.SetStateAction<boolean>>
    setReult : React.Dispatch<React.SetStateAction<Data>>
    setTag : React.Dispatch<React.SetStateAction<string>>
}
interface ResultProp{
    result?: Data
    setResultView? : React.Dispatch<React.SetStateAction<boolean>>
    tag: string
}


interface BlogFull{
    id :string 
    title :string 
    detail :string 
    blog :string 
    isMemberOnly :boolean 
    tags : [string] 
    creator:Creator

}

export type {Data,PageInfo,Blog,BlogSmall,SearchProp,ResultProp,BlogFull}