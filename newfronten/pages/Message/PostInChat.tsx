import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { GET_POST_BY_ID } from "../../query/queries";
import Post from "../Post/Post";

export function PostInChat(props:any){
    const {data, loading, refetch} = useQuery(GET_POST_BY_ID,{
        variables:{
            id:props.props
        }
    })
    useEffect(()=>{
        console.log(props);
        
    })
    if(data &&!loading){
        return(
            <Post
            id={data.getPost.id}
                userId={data.getPost.userId}
                message={data.getPost.caption}
                photoUrl={data.getPost.photo_url}
                videoUrl={data.getPost.video_url}
                likes={data.getPost.likes}
                comments={data.getPost.comments}
                refetch = {refetch}/>
        )
    }
}