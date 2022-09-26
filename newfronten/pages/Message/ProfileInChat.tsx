import {useQuery} from "@apollo/client"
import { Avatar } from "@mui/material";
import { USER } from "../../query/queries";
import {useNavigate} from "react-router-dom"
import "./ProfileInChat.css"
export default function ProfileInChat({props}:{props:any}){
    console.log(props);
    const {data, loading} = useQuery(USER,{
        variables:{
            id:props
        }
    })
    const navigate = useNavigate();
    
    if(data && !loading){
        return (
            <div className="prof" onClick={()=>navigate(`/profile/${props}`)}>
                 <Avatar className="avatar" src={data.user.profile_photo} />
                 <h3>{data.user.name}</h3>
            </div>
        )
    }
   
}