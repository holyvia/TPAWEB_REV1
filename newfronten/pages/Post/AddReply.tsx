import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { UseCurrentUser } from '../../lib/userContext'
import { COMMENT_POST, GET_COMMENTS, GET_LIMIT_COMMENT, LIKE_COMMENT, REPLY_COMMENT, UNLIKE_COMMENT } from '../../query/queries'
import { EachComment } from './EachComment'
import '../Feed/NewPost.css'

interface SetPopup {
    setClass: (params: any) => any
    id: any
    refetchPost: () => any
    commentID: any
}

export function AddReply({ setClass, id, refetchPost }: SetPopup) {
    const [popup__class, setPopup__class] = useState('')
    const [comment, setComment] = useState('')
    const [addReplyFunc] = useMutation(REPLY_COMMENT)
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

    // function handleAddComment() {
    //     addCommentFunc({
    //         variables: {
    //             postId: id,
    //             commenterId: getUser().id,
    //             comment: comment
    //         }
    //     }).then(() => {
    //         refetch()
    //         refetchPost()
    //     })
    // }
    function handleAddReply() {
    //     addReplyFunc({
    //         variables: {
    //             postId: id,
    //             commenterId: getUser().id,
    //             comment: comment,
    //             commentID:
    //         }
    //     }).then(() => {
    //         refetch()
    //         refetchPost()
    //     })
    }

    function done(){
        setLoadedMore(false)
        setClass("addCommentInvisible")
    }


    console.log(id);


        return (
            <div className='reply'>
                <p>Reply</p>
                <input type="text" className="comment" value={comment} placeholder="reply" onChange={(e) => setComment(e.target.value)} />
                <button onClick={() => handleAddReply()}>Post</button>
                <button onClick={done}>Done</button>
            </div>
        )
    
}