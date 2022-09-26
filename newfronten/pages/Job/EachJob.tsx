import { useQuery } from "@apollo/client";
import { Avatar } from "@mui/material";
import { UseCurrentUser } from "../../lib/userContext";
import { USER } from "../../query/queries";
import blankProfile from '../../assets/blank-profile.png';
import "../Post/Post.css"

export function EachJob({props}:{props:any}){
    const {getUser} = UseCurrentUser()
    const userID = getUser().id
    const {data, loading} = useQuery(USER,{
        variables:{
            id:props.UserID
        }
    })
    console.log(props);
    
    if(data && !loading){

    return (
        <div className="post">
        <div className="post__header">
        <Avatar className='profile__photo' src={data.user.photo_profile ? data.user.photo_profile : blankProfile}></Avatar>
            
            <div className="post__info">
            <h2>{data.user.name}</h2>
            </div>
        </div>

        <div className="job__body">
            <h3>{props.Title}</h3>
            <p>Company: {props.Company}</p>
            <p>Position: {props.Position}</p>
            <p>Description: {props.Description}</p>
        </div>
        </div>
        )
    }
    return(
        ""
    )
}