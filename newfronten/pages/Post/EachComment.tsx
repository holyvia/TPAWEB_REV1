import { useMutation, useQuery } from "@apollo/client"
import { Avatar } from "@mui/material"
import { forwardRef, useEffect, useState } from "react"
import { UseCurrentUser } from "../../lib/userContext"
import { GET_COMMENTS, GET_REPLY, LIKE_COMMENT, REPLY_COMMENT, UNLIKE_COMMENT, USER } from "../../query/queries"
import InputOption from "../InputOption/InputOption"
import './EachComment.css'
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { AddComment } from "./AddComment"
import { AddReply } from "./AddReply"
import { Reply } from "./Reply"

export function EachComment({ props, refetch, refetch2, refetchPost, postId }: { props: any, refetch: any, refetch2: any, refetchPost: any, postId: any }) {
  const { getUser } = UseCurrentUser()
  const [likeCommentFunc] = useMutation(LIKE_COMMENT)
  const [unlikeCommentFunc] = useMutation(UNLIKE_COMMENT)
  const [addReplyFunc] = useMutation(REPLY_COMMENT)
  const [reply, setReply] = useState('')
  const [replyClass, setReplyClass] = useState('addCommentVisible')
  const { data: userData, loading: loadingUser } = useQuery(USER, {
    variables: {
      id: props.userId
    }
  })
  const { data: replyData, loading: loadingReply, refetch:refetchReply} = useQuery(GET_REPLY, {
    variables: {
      commentId: props.id
    }
  })
  useEffect(() => {
    console.log(props);

  }, [])
  function handleLikeComment() {
    if (props.likes != null && props.likes.includes(getUser().id)) {
      unlikeCommentFunc({
        variables: {
          commentId: props.id,
          unlikerId: getUser().id
        }
      }).then(() => {
        console.log("done unlike");
        refetch()
        refetch2()
      })
    }
    else {
      likeCommentFunc({
        variables: {
          commentId: props.id,
          likerId: getUser().id
        }
      }).then(() => {
        console.log("done like");
        refetch()
        refetch2()
      })
    }
  }
  function handleAddReply() {
    console.log(postId);

    addReplyFunc({
      variables: {
        postId: postId,
        commenterId: getUser().id,
        comment: reply,
        commentId: props.id
      }
    }).then(() => {
      console.log("done reply");
      refetch()
      refetch2()
      refetchReply()
    })
  }
  if (userData && !loadingUser && !loadingReply) {
    if (props.replyToCommentId == null || props.replyToCommentId == "") {
      return (
        <div className="comment__container">
          <Avatar src={getUser().profile_photo} />
          <div className="comment__detail">
            <h5>{userData.user.name}</h5>
            <p>{props.comment}</p>
            <div className="likeComment" >
              {props.likes == null ? (
                <div className="likes_number">0</div>) :
                (<div className="likes_number">{props.likes.length}</div>)}
              <div className="like_icon" onClick={handleLikeComment}>
                <InputOption Icon={ThumbUpAltOutlinedIcon} title="Like" color="gray" />
              </div>
            </div>
            <div className="likeComment">
              <input value={reply} onChange={(e) => setReply(e.target.value)} type="text" name="" id="" placeholder="reply" />
              <button onClick={handleAddReply}>Reply</button>
            </div>
            <div className="replies">
              {
                (replyData?
                  (replyData.getReply.map((rep:any)=>(
                    <Reply props={rep}/>
                  )))
                  :"")
              }
          </div>
          </div>
          
        </div>
      )
    }
  

  }
}