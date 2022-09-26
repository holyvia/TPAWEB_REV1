import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { UseCurrentUser } from '../../lib/userContext'
import { COMMENT_POST, GET_COMMENTS, GET_LIMIT_COMMENT, LIKE_COMMENT, REPLY_COMMENT, UNLIKE_COMMENT } from '../../query/queries'
import { EachComment } from './EachComment'
import '../Feed/NewPost.css'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../firebase'
import { CommentBankRounded } from '@mui/icons-material'

interface SetPopup {
    setClass: (params: any) => any
    id: any
    refetchPost: () => any
    postOwner: any
}

export function AddComment({ setClass, id, refetchPost, postOwner }: SetPopup) {
    const [popup__class, setPopup__class] = useState('')
    const [comment, setComment] = useState('')
    const [addCommentFunc] = useMutation(COMMENT_POST)
    
    const { getUser } = UseCurrentUser()
    const [loadedMore, setLoadedMore] = useState(false)

    const { data: comments, loading: loadingComments, refetch } = useQuery(GET_COMMENTS, {
        variables: {
            postId: id
        }
    })
    const { data: limitedComment, loading: loadingLimitedComment, refetch: refetchLimitedComment } = useQuery(GET_LIMIT_COMMENT, {
        variables: {
            postId: id
        }
    })
    useEffect(()=>{
        setLoadedMore(false)
    },[])
    function handleAddComment() {
        addCommentFunc({
            variables: {
                postId: id,
                commenterId: getUser().id,
                comment: comment,
                
            }
        }).then(async() => {
            const a = await addDoc(collection(db,"users",postOwner, "notif"),
            {
                type: "CommentAdd",
                message: getUser().name+" add comment to your post.",
                createdAt: new Date(),
                photoProfile: getUser().photo_profile,
                fromId:getUser().id
            }).then(()=>{
                refetch()
                refetchPost()
                refetchLimitedComment()
            })
        })
    }

    useEffect(()=>{
        console.log(loadedMore +"  loadedMore");
        
    },[loadedMore])

    function done(){
        setLoadedMore(false)
        setClass("addCommentInvisible")
    }


    console.log(id);
    

    
    if (comments && limitedComment && limitedComment.getLimitComment != null && !loadingComments && !loadingLimitedComment) {
        console.log(id);
        console.log(limitedComment.getLimitComment);
        console.log(comments.getComment);
        
        

        return (
            <div>
                <h4>Comment</h4>
                <input type="text" className="comment" value={comment} placeholder="comment" onChange={(e) => setComment(e.target.value)} />
                <button onClick={() => handleAddComment()}>Post</button>
                <button onClick={done}>Done</button>
                {(loadedMore==true)?
                comments.getComment.map((com: any) => {
                    if (com != null) {
                        return (
                            <EachComment props={com} refetch={refetch} refetch2={refetchLimitedComment}  refetchPost={refetchPost} postId={id} />
                        )
                    }
                }

                ):
                limitedComment.getLimitComment.map((com: any) => {
                    if (com != null) {
                        return (
                            <EachComment props={com} refetch={refetchLimitedComment} refetch2={refetch} refetchPost={refetchPost} postId={id} />
                        )
                    }
                }

                )}
                {loadedMore==false && comments.getComment.length>3?
                <button onClick={()=>setLoadedMore(true)}> Load More</button>
                :""}
            </div>
        )   
    }
    else {
        return (
            <div>
                <h4>Comment</h4>
                <input type="text" className="comment" value={comment} placeholder="comment" onChange={(e) => setComment(e.target.value)} />
                <button onClick={() => handleAddComment()}>Post</button>
                <button onClick={done}>Done</button>
            </div>
        )
    }
}