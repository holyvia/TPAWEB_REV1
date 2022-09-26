import React, { forwardRef, useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import InputOption from "../InputOption/InputOption";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useMutation, useQuery } from "@apollo/client";
import { LIKE_POST, UNLIKE_POST, USER } from "../../query/queries";
import { UseCurrentUser } from "../../lib/userContext";
import { AddComment } from "./AddComment";
import blankProfile from '../../assets/blank-profile.png'

function PostInSearch({props}: {props:any}){
  const { getUser } = UseCurrentUser()
  const { data, loading } = useQuery(USER, {
    variables: {
      id: props.UserID
    }
  })

  // console.log(props);
  if(data && !loading){
    console.log(props);
    
    return (
      <div className="post">
      <div className="post__header">
      <Avatar className='profile__photo' src={data.user.photo_profile ? data.user.photo_profile : blankProfile}></Avatar>
        
        <div className="post__info">
        <h2>{data.user.name}</h2>
        </div>
      </div>

      <div className="post__body">
        {props.PhotoURL == '' ? ("") : (
          <img src={props.PhotoURL} alt="" />
        )}
        {props.VideoURL == '' ? ("") : (
          <video src={props.VideoURL} controls></video>
        )}

        <p>{props.Caption}</p>
      </div>
    </div>
  );
}
else{
  return(
    <div>
      none
    </div>
  )
}
};

export default PostInSearch;
