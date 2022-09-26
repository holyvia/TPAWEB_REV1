import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { VideoFile } from "@mui/icons-material";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Mention, MentionsInput } from "react-mentions";
import { UseCurrentUser } from "../../lib/userContext";
import { CREATE_POST, GENERATE_ID } from "../../query/queries";
import { mentionInputPostStyle, mentionStyle } from "../RichTect/MentionStyle";
import './NewPost.css'

interface SetPopup {
    setClass: (params: any) => any
    refetch: ()=>any
    mentionDatas: any
}


export function NewPost({ setClass,refetch, mentionDatas }: SetPopup) {

    const [generateID, { data, loading}] = useLazyQuery(GENERATE_ID,{
    })
    const [filename, setFilename] = useState('')
    const storage = getStorage()
    const [fileUpload, setFileUpload] = useState(false)
    const [photoURL, setPhotoURL] = useState('')
    const [videoURL, setVideoURL] = useState('')
    const { getUser } = UseCurrentUser()
    const [generatedId, setGeneratedId] = useState('')
    const [createPost] = useMutation(CREATE_POST)
    const [caption, setCaption] = useState('')
    const [popup__class, setPopup__class] = useState('viewable')
    const [post__button, setPost__button] = useState('postButtonUnseen')
    const videoFile = useRef(null)
    const photoFile = useRef(null)
    const [inputVideoComponent, setInputVideoComponent] = useState('per__type');
    const [inputPhotoComponent, setInputPhotoComponent] = useState('per__type');
    const [photoComponent, setPhotoComponent] = useState('hidden');
    const [videoComponent, setVideoComponent] = useState('hidden');
    const [viewedText, setViewedText] = useState("");

    useEffect(()=>{
        generateID()
        // console.log(mentionDatas);
        
    },[])

    async function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
        // setFilename(photo.split('\\')[photo.split('\\').length-1]);
        console.log(event);
        if (data && !loading) {
            console.log(data);
            const file = event.target.files[0]
            let photoRef = ref(storage, `posting_photo/posts/${getUser().id}/${data.generateID}`)
            setInputVideoComponent("hidden");
            await uploadBytes(photoRef, file)
            toast.promise(
                getDownloadURL(photoRef).then((e) => {
                    setPhotoURL(e)
                    if (caption != "")
                        setPost__button("postButtonSeen");
                }), {
                loading: "Uploading",
                success: "Uploaded",
                error: "Error"
            })
            const url = await getDownloadURL(photoRef)
            setPhotoURL(url)
            setVideoURL('')
            console.log(url);
            setPhotoComponent("fileComponent")
            
        }
    }

    function removePhotoFile() {
        photoFile.current.value = null
        setPhotoURL('')
        setInputVideoComponent("per__type");
        setPhotoComponent("hidden")
    }

    function removeVideoFile() {
        videoFile.current.value = null
        setVideoURL('')
        setInputPhotoComponent("per__type");
        setVideoComponent("hidden")
    }

    async function uploadVideo(event: ChangeEvent<HTMLInputElement>) {
        // setFilename(photo.split('\\')[photo.split('\\').length-1]);
        console.log(event);
        if (data && !loading) {
            console.log(data);
            const file = event.target.files[0]
            setInputPhotoComponent("hidden");
            let videoRef = ref(storage, `posting_video/posts/${getUser().id}/${data.generateID}`)
            await uploadBytes(videoRef, file)
            toast.promise(
                getDownloadURL(videoRef).then((e) => {
                    setPhotoURL(e)
                    if (caption != "")
                        setPost__button("postButtonSeen");
                }), {
                loading: "Uploading",
                success: "Uploaded",
                error: "Error"
            })
            const url = await getDownloadURL(videoRef)
            setPhotoURL('')
            setVideoURL(url)
            console.log(url);
            
            setVideoComponent("fileComponent")
            
        }
    }

    // function handleCaption(e: any , newValue : any , newPlainTextValue: any){
    //     // setText(e.target.value)
    //     // setText(newPlainTextValue)
    //     setViewedText(e.target.value)
    //     console.log(newPlainTextValue);
    //     console.log(newValue);
        
        
    //     setCaption(e.target.value)
    // }

    function handleSavePost() {
        if (caption == "") {
            toast.error("Caption cannot be empty")
        }
        else {
            createPost({
                variables: {
                    id: data.generateID,
                    userId: getUser().id,
                    caption: caption,
                    photo_url: photoURL,
                    video_url: videoURL
                }
            }).then(() => {
                setClass('hidden')
                console.log("success post");
                refetch()
                generateID()
                setCaption("")
                videoFile.current.value = null
                photoFile.current.value = null
                setVideoURL('')
                setPhotoURL('')
                setInputVideoComponent("per__type")
                setInputPhotoComponent("per__type")
            })
        }
    }
    function cancel_post(){
        videoFile.current.value = null
        photoFile.current.value = null
        setClass('hidden')
        setCaption('')
    }

    return (
        <div className={popup__class}>
            <Toaster position="top-center" />
            <h4>Create Post</h4>
            <input type="text" className="caption" value={caption} placeholder="what do you want to talk about" onChange={(e) => setCaption(e.target.value)} />
            <MentionsInput id='test-rich-text' value={caption} style={{ width: "100%", height: "100px", ...mentionInputPostStyle }} placeholder="What do you want to talk about" onChange={(e)=>setCaption(e.target.value)}>
                <Mention
                    trigger="@"
                    data={mentionDatas}
                    style={mentionStyle}
                />
                {/* <Mention
                    trigger="#"
                    data={hastagDatas}
                    style={mentionStyle}
                /> */}
            </MentionsInput>
            <div className="add__file">
                <div className={inputPhotoComponent}>

                    <label>Photo</label>
                    <input ref={photoFile} type="file" accept="image/png, image/gif, image/jpeg" onChange={(e) => uploadPhoto(e)} />
                    <button onClick={removePhotoFile}>remove photo</button>
                </div>
                <img className={photoComponent} src={photoURL} alt="" />
                <div className={inputVideoComponent}>

                    <label>Video</label>
                    <input ref={videoFile} type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => uploadVideo(e)} />
                    <button onClick={removeVideoFile}>remove video</button>
                </div>
                <video className={videoComponent} src={videoURL}></video>
            </div>
            <button className={post__button} onClick={() => handleSavePost()}>Post</button>
            <button onClick={cancel_post}>cancel</button>
        </div>
    )

}