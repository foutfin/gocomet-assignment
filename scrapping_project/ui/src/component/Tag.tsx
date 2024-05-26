import { Link } from "react-router-dom"

function Tag({tag}:{tag:string}){
    return(
        <Link className="card-link" to={`/search/${tag}`} target="_blank" rel="noopener noreferrer" > 
                <span className="tag">{tag}</span>
            </Link>
    )
}

export default Tag