import React, { ChangeEvent, useEffect, useState } from "react";
import "./Feed.css";
import CreateIcon from "@mui/icons-material/Create";
import InputOption from "../InputOption/InputOption";
import ImageIcon from "@mui/icons-material/Image";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import Post from "../Post/Post";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { NewPost } from "./NewPost";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_CONNECT_USERS, GET_POSTS, USER } from "../../query/queries";
import { UseCurrentUser } from "../../lib/userContext";
import { SuggestionDataItem } from "react-mentions";

// import FlipMove from "react-flip-move";



function Feed() {
  const { getUser } = UseCurrentUser()
  const [input, setInput] = useState(() => "");
  const [posts, setPosts] = useState(() => []);
  const { data, loading, fetchMore, refetch } = useQuery(GET_POSTS, {
    variables: {
      id: getUser().id,
      limit: 5,
      offset: 0
    }
  })
  const { data: userData, loading: userLoading } = useQuery(USER, {
    variables: {
      id: getUser().id
    }
  })
  const { data: connectedUserData, loading: connectedUserLoading } = useQuery(GET_CONNECT_USERS, {
    variables: {
      id: getUser().id
    }
  })
  const [photo, setPhoto] = useState({});
  const [video, setVideo] = useState({});
  const [filename, setFilename] = useState('')
  const [create__popup__class, setCreate__popup__class] = useState('hidden')
  const storage = getStorage()
  const [photoURL, setPhotoURL] = useState('')
  const [currY, setCurrY] = useState(0)
  const [connectedUser, setConnectedUser] = useState([])
  const [passConnectedUser, setPassConnectedUser] = useState<SuggestionDataItem[]>()
  const [currId, setCurrId] = useState('')
  function fetchMoreFunction() {
    console.log(data.getPosts.length);

    fetchMore({
      variables: {
        offset: data.getPosts.length
      }
    }).then(() => {
      console.log(data);

    })
  }
  // useEffect(()=>{
  //   if(connectedUser!=null){
  //     console.log(connectedUser)

  //   }
  //   else{
  //     console.log("nda ada");

  //   }
  // },[connectedUser])

  // function getConnectedUser(){
  //   console.log(userData.user.connected_user);

  //   let mentionDatas: SuggestionDataItem[] = []
  //     userData.user.connected_user.map((currId: any) => {
  //       console.log(currId);

  //       getUserId({
  //           variables: {
  //               id:currId
  //           }
  //       }).then((e) => {
  //         console.log(e);

  //           if (e.data && !e.loading && e.called==true) {
  //               let mentionData: SuggestionDataItem = { id: "", display: "" }
  //               let at: string = "@"
  //               mentionData.id = e.data.user.id
  //               mentionData.display = at.concat(e.data.user.name)
  //               mentionDatas.push(mentionData)
  //               console.log(mentionDatas);
  //               e.called = false
  //           }
  //       })
  //   })
  // }

  // useEffect(()=>{
  //   if(userData!=null &&!userLoading){
  //     console.log("disini");
  //     console.log( userData.user.connected_user);

  //     getConnectedUser()

  //   }
  // },[userData])

  useEffect(() => {
    if (connectedUserData != null && !connectedUserLoading) {
      setConnectedUser(connectedUserData.getConnectUser)
    }
  }, [connectedUserData])

  useEffect(() => {
    console.log(connectedUser);
    let mentionDatas: SuggestionDataItem[] = []
    connectedUser.map((us: any) => {
      console.log(us);
      let mentionData: SuggestionDataItem = { id: "", display: "" }
      let at: string = "@"
      mentionData.id = us.id
      mentionData.display = at.concat(us.name)
      mentionDatas.push(mentionData)
      console.log(mentionDatas);
    })
    setPassConnectedUser(mentionDatas)
  }, [connectedUser])

  useEffect(() => {
    console.log(data);
    const onScroll: EventListener = (event: Event) => {
      // console.log("--------------",document.querySelector(".postContainer").offsetHeight);

      if (window.innerHeight + window.scrollY >= document.querySelector(".postContainer").offsetHeight) {
        fetchMoreFunction()
      }
    }


    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  })

  useEffect(() => {
    refetch()
  }, [create__popup__class])

  if (data) {
    console.log(data);

    return (
      <div className="feed">
        <div className={create__popup__class}>
          <NewPost setClass={setCreate__popup__class} refetch={refetch} mentionDatas={passConnectedUser} />
        </div>
        <div className="feed__inputContainer">

          <div className="feed__input" onClick={() => setCreate__popup__class('create__popup')}>
            <CreateIcon />
            <form>
              <input
                type="text"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <button type="submit">
                Send
              </button>
            </form>
          </div>
          <div className="feed__inputOptions">
            <InputOption Icon={ImageIcon} title="Photo" color="#70B5F9" />
            <InputOption Icon={SubscriptionsIcon} title="Video" color="#E7A33E" />
            <InputOption Icon={EventNoteIcon} title="Event" color="#C0CBCD" />
            <InputOption
              Icon={CalendarViewDayIcon}
              title="Write article"
              color="#7FC15E"
            />
          </div>
        </div>

        {/* Posts */}
        <div className="postContainer">
          {data != undefined ? (
            data.getPosts.map((item) => {
              console.log(item)
              if(!userData.user.blocked_user.includes(item.userId)){
                return (
                  <Post
                    id={item.id}
                    userId={item.userId}
                    message={item.caption}
                    photoUrl={item.photo_url}
                    videoUrl={item.video_url}
                    likes={item.likes}
                    comments={item.comments}
                    refetch={refetch}
                  />
                );
              }
            })) : ("")}
        </div>
      </div>
    );
  }

}

export default Feed;
