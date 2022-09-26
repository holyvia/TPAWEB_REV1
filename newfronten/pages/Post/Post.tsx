import React, { forwardRef, useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import InputOption from "../InputOption/InputOption";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { LIKE_POST, SEARCH_CONNECT_USER, UNLIKE_POST, USER } from "../../query/queries";
import { UseCurrentUser } from "../../lib/userContext";
import { AddComment } from "./AddComment";
import blankProfile from '../../assets/blank-profile.png'
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import toast, { Toaster } from "react-hot-toast";
import RichText from "../RichTect/RichText";


const Post = forwardRef(({ id, userId, videoUrl, message, photoUrl, likes, comments, refetch }: { id: any, userId: any, videoUrl: any, message: any, photoUrl: any, likes: any, comments: any, refetch: any }, ref: any) => {
  const [likeFunc] = useMutation(LIKE_POST)
  const [unlikeFunc] = useMutation(UNLIKE_POST)
  const { getUser } = UseCurrentUser()
  const [subStringConnectSearch, setSubStringConnectSearch] = useState('')
  const [commentClass, setCommentClass] = useState('addCommentInvisible')
  const [sendComponent, setSendComponent] = useState('hidden')
  const [sendMessage, setSendMessage] = useState('')
  const [rooms, setRooms] = useState([])
  const [roomID, setRoomID] = useState('')
  const { data, loading:loadingUser } = useQuery(USER, {
    variables: {
      id: userId
    }
  })
  const [searchConnectFunc, { data: getConnectUserData, loading: getConnectUserLoading, refetch: refetchSearchResult }] = useLazyQuery(SEARCH_CONNECT_USER)
  useEffect(() => {
    if (likes != null) {
 


    }
  }, [])

  async function getRooms() {
    let arrayRooms: any = []
    const q = query(collection(db, "rooms"))
    const docs = await getDocs(q)
    docs.forEach(doc => {
      arrayRooms.push({ ...doc.data(), id: doc.id })
    }
    )
    setRooms(arrayRooms)
  }

  useEffect(() => {
    getRooms()
  },[])

  useEffect(()=>{
    console.log(rooms);
    
  },[rooms])

  function handleLike() {
    if (likes != null && likes.includes(getUser().id)) {
      unlikeFunc({
        variables: {
          id: id,
          unlikerId: getUser().id
        }
      }).then(() => {
        console.log("done unlike");
        refetch()
      })
    }
    else {
      likeFunc({
        variables: {
          id: id,
          likerId: getUser().id
        }
      }).then(async () => {
        const a = await addDoc(collection(db, "users", data.user.id, "notif"),
          {
            type: "postLiked",
            message: getUser().name + " like your post.",
            createdAt: new Date(),
            photoProfile: getUser().photo_profile,
            fromId: getUser().id
          }
        )
        refetch()
      })
    }
  }

  function searchConnect() {
    searchConnectFunc({
      variables: {
        id: getUser().id,
        keyword: subStringConnectSearch,
        limit: 3,
        offset: 0
      }
    })
    refetchSearchResult()
  }

  async function sendPost(userId: any) {
    setRoomID("")
    rooms.forEach((room) => {
      console.log(room.users_id);
      console.log(room.users_id.includes(userId) && room.users_id.includes(getUser().id));
      
      if (room.users_id.includes(userId) && room.users_id.includes(getUser().id)) {
        setRoomID(room.id)
        
      }
      console.log(roomID);
    })
    
    if (roomID == "") {
      await addDoc(collection(db, "rooms"), {
        users_id: [getUser().id, id]
    }).then(async (e)=>{
      await addDoc(collection(db, "rooms", e.id, "chats"), {
        message: sendMessage,
        createdAt: new Date(),
        sender: getUser().id,
        postId: id
      }).then(async (e) => {
        console.log("send post");
        
        setSendMessage("")
        if (id != undefined) {
          toast.promise(

            addDoc(collection(db, "users", userId, "notif"),
            {
              type: "chat",
              message: getUser().name + " chats you.",
              createdAt: new Date(),
              photoProfile: getUser().photo_profile,
              fromId: getUser().id
            }),{
                loading: "Sending",
                success: "Sent",
                error: "Error"
            }
            )
          }
        setSendComponent("hidden")
      })
    })
    }
    else {
      await addDoc(collection(db, "rooms", roomID, "chats"), {
        message: sendMessage,
        createdAt: new Date(),
        sender: getUser().id,
        postId: id
      }).then(async (e) => {
        console.log(e);    
        console.log("done send");
        
        setSendMessage("")
        if (id != undefined) {
          toast.promise(
            
           addDoc(collection(db, "users", userId, "notif"),
            {
              type: "chat",
              message: getUser().name + " chats you.",
              createdAt: new Date(),
              photoProfile: getUser().photo_profile,
              fromId: getUser().id
            }),{
              
                loading: "Sending",
                success: "Sent",
                error: "Error"
      
            }
            )
            setSendComponent("hidden")
          }
          
        })
    }
  }

  useEffect(() => {
    if (getConnectUserData != undefined) {
      console.log(getConnectUserData);
    }
  }, [getConnectUserData])

  if (data && !loadingUser) {

    return (
      <div ref={ref} className="post">
        <div className="post__header">
          <Toaster position="top-center"/>
          <Avatar className='profile__photo' src={data.user.photo_profile ? data.user.photo_profile : blankProfile}></Avatar>
          <div className="pop__up">
            <Avatar className='profile__photo' src={data.user.photo_profile ? data.user.photo_profile : blankProfile}></Avatar>
            <div className="data__pop__up">
              <h2>{data.user.name}</h2>
              <p>{data.user.education}</p>
            </div>
          </div>
          <div className="post__info">
            <h2>{data.user.name}</h2>
          </div>
        </div>

        <div className="post__body">
          {photoUrl == '' ? ("") : (
            <img src={photoUrl} alt="" />
          )}
          {videoUrl == '' ? ("") : (
            <video src={videoUrl} controls></video>
          )}
          <p>{message}</p>
          <RichText texts={message}></RichText>
        </div>
        <div className="post__buttons">
          <div className={commentClass}>
            <AddComment id={id} setClass={setCommentClass} refetchPost={refetch} postOwner={data.user.id} />
          </div>
          {likes == null ? (
            <div className="likes_number">0</div>) :
            (<div className="likes_number">{likes.length}</div>)}<div onClick={handleLike}>
            <InputOption Icon={ThumbUpAltOutlinedIcon} title="Like" color="gray" />
          </div>
          {comments == null ? (
            <div className="likes_number">0</div>) :
            (<div className="likes_number">{comments.length}</div>)}<div onClick={() => setCommentClass("addCommentVisible")}>
            <InputOption Icon={ChatOutlinedIcon} title="Comment" color="gray" />
          </div>
          <InputOption Icon={ShareOutlinedIcon} title="Share" color="gray" />
          <div className="send" onClick={() => setSendComponent('sendComponent')}>
            <InputOption Icon={SendOutlinedIcon} title="Send" color="gray" />
          </div>
        </div>
        <div className={sendComponent}>
          <div className="searchPart">
            <input value={subStringConnectSearch} onChange={(e) => setSubStringConnectSearch(e.target.value)} />
            <button onClick={searchConnect}>search</button>
          </div>
          {
            getConnectUserData != undefined && !getConnectUserLoading ? <div className="searchResult">
              {getConnectUserData.searchConnect.users.map((user) =>
              (<div className="eachRes" onClick={() => sendPost(user.id)}>
                <Avatar className='profile__photo' src={user.photo_profile ? user.photo_profile : blankProfile}></Avatar>
                <h4>{user.name}</h4>
              </div>)
              )}

            </div> : ""
          }

          <button onClick={() => setSendComponent("hidden")}>cancel</button>
        </div>
      </div>
    );
  }
});

export default Post;
