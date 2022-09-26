import { useQuery, useLazyQuery } from "@apollo/client"
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebase"
import { UseCurrentUser } from "../../lib/userContext"
import { GENERATE_ID, SEARCH, SEARCH_CONNECT_USER, USER } from "../../query/queries"
import PeopleContainer from "./PeopleContainer"
import "./Message.css"
import Header from "../Header/Header"
import { UseCurrentTheme } from "../../lib/themeContext"
import { Footer } from "../Footer/Footer"
import { EachSearchRes } from "../Searching/EachSearchRes"
import { SearchRes } from "./SearchRes"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import toast, { Toaster } from "react-hot-toast"
import { PostInChat } from "./PostInChat"
import ProfileInChat from "./ProfileInChat"
import {useNavigate} from "react-router-dom"

export default function Message() {
    const { getUser } = UseCurrentUser()
    const storage = getStorage()
    const [roomID, setRoomID] = useState("")
    const [rooms, setRooms] = useState([{}])
    const [chats, setChats] = useState([{}])
    const [message, setMessage] = useState("")
    const { id } = useParams()
    const [user, setUser] = useState()
    const [subString, setSubString] = useState("")
    const [photoURL, setPhotoURL] = useState("")
    const photoFile = useRef(null)
    const navigate = useNavigate()
    const [room, setRoom]: any = useState()
    useEffect(() => {
        const q = query(collection(db, "rooms"))
        onSnapshot(q, (docs) => {
            let array: any = []
            docs.forEach(doc => {
                if (doc.id === roomID) {
                    array.push({ ...doc.data(), id: doc.id })
                }
            })
            setRoom(array[0])
        })
    }, [roomID])
    const [generateID, { data: generatedID, loading: loadingID }] = useLazyQuery(GENERATE_ID, {
    })
    const { data, loading } = useQuery(USER, {
        variables: {
            id: id
        }
    })
    const [uploadedFile, setUploadedFile] = useState()
    const [searchQuery, { data: searchData, loading: searchLoading, error }] = useLazyQuery(SEARCH_CONNECT_USER)
    const { getTheme } = UseCurrentTheme()

    function searchFunc() {
        searchQuery({
            variables: {
                id: getUser().id,
                keyword: subString,
                limit: 5,
                offset: 0
            }
        })
        console.log(searchData);

    }
    if (data)
        console.log(data);
    useEffect(() => {


        const q = query(collection(db, "rooms"))
        onSnapshot(q, (docs) => {
            let array = [{}]

            docs.forEach(doc => {
                // if(doc!= null && doc!=undefined){

                if (doc.data().users_id.includes(getUser().id)) {
                    array.push({ ...doc.data(), id: doc.id })
                }
                if (id != undefined) {

                    if (doc.data().users_id.includes(getUser().id) && doc.data().users_id.includes(id))
                        setRoomID(doc.id)
                }
                // }
            })
            setRooms(array)
            console.log(rooms.length);


        })
    }, [id])

    useEffect(() => {
        if (roomID != "") {
            const q = query(collection(db, "rooms", roomID, "chats"), orderBy("createdAt", "asc"))
            onSnapshot(q, (docs) => {
                let array = [{}]
                docs.forEach(doc => {
                    array.push({ ...doc.data(), id: doc.id })
                })
                setChats(array)
            })
        }
    }, [roomID])

    async function handleVideoCall() {
        if (id !== "") {
            if (room.videoRoomID != undefined) {
                // console.log("asd");
                navigate("/vidcall/" + room.videoRoomID)
                return
            }
            const callDoc = await doc(collection(db, "calls"));
            await setDoc(callDoc, {
                created: false,
            }).then(() => {
                updateDoc(doc(db, "rooms", roomID), {
                    videoRoomID: callDoc.id
                })
            })
            navigate("/vidcall/" + callDoc.id);
        }
    }

    async function sendChat(senderID: any) {
        if (photoURL == "") {

            await addDoc(collection(db, "rooms", roomID, "chats"), {
                message: message,
                createdAt: new Date(),
                sender: senderID
            }).then(async (e) => {
                setMessage("")
                if (id != undefined) {
                    const a = await addDoc(collection(db, "users", id, "notif"),
                        {
                            type: "chat",
                            message: getUser().name + " chats you.",
                            createdAt: new Date(),
                            photoProfile: getUser().photo_profile,
                            fromId: getUser().id
                        })
                }

            })
        }
        else {
            await addDoc(collection(db, "rooms", roomID, "chats"), {
                message: message,
                createdAt: new Date(),
                sender: senderID,
                photoURL: photoURL
            }).then(async (e) => {
                setMessage("")
                if (id != undefined) {
                    const a = await addDoc(collection(db, "users", id, "notif"),
                        {
                            type: "chat",
                            message: getUser().name + " chats you.",
                            createdAt: new Date(),
                            photoProfile: getUser().photo_profile,
                            fromId: getUser().id
                        })
                }

            })
        }
        setPhotoURL("")
    }

    function handleMessage(e: any) {
        setMessage(e)
    }

    function handleClick() {

    }

    console.log(chats);


    useEffect(() => {
        console.log(searchData);

    }, [searchData])

    useEffect(() => {
        generateID()
    }, [])

    async function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
        // setFilename(photo.split('\\')[photo.split('\\').length-1]);

        console.log(event);
        if (generatedID) {
            const file = event.target.files[0]
            console.log(file);

            let photoRef = ref(storage, `message/${getUser().id}/${generatedID.generateID}`)
            // setInputVideoComponent("hidden");
            await uploadBytes(photoRef, file)
            toast.promise(
                getDownloadURL(photoRef).then((e) => {
                    setPhotoURL(e)
                }), {
                loading: "Uploading",
                success: "Uploaded",
                error: "Error"
            })
            const url = await getDownloadURL(photoRef)
            setPhotoURL(url)
            console.log(url);

        }
    }

    return (
        <div className="app" style={{ ...getTheme() }}>
            <>
                <Toaster position="top-center" />
                <div className="header">
                    <Header />
                </div>
                <div className="app__body">
                    <div className="message_outer">
                        <div className="listOfMessage">
                            <h3>Messaging</h3>
                            <div className="searchdiv">
                                <input type="text" value={subString} onChange={(e) => { setSubString(e.target.value) }} />
                                <button onClick={searchFunc}>Search</button>

                            </div>
                            <div className="searchResult">
                                {
                                    searchData != undefined && searchData.searchConnect.users != null ?
                                        (
                                            searchData.searchConnect.users.map((item) => (
                                                <SearchRes props={item} />
                                            )))
                                        :
                                        console.log(searchData)


                                }
                            </div>
                            {rooms.map((room: any) =>
                                room.id != undefined ?
                                    <PeopleContainer props={room} /> : ""
                            )}
                        </div>
                        <div className="message">
                            <div className="chatHistory">

                                {chats.map((chat: any) =>
                                    chat != {} ?
                                        chat.createdAt != undefined ?
                                            chat.sender != getUser().id ?
                                                // console.log(new Date(chat.createdAt.seconds * 1000 + chat.createdAt.nanoseconds / 1000000))
                                                <div className="outer__left">
                                                    {chat.message != "" ?
                                                        <div className='left__bubble_chat'>
                                                            <p className="chat-text">{chat.message}</p>
                                                            <p>{new Date(chat.createdAt.seconds * 1000 + chat.createdAt.nanoseconds / 1000000).getHours().toString().padStart(2, "0")}:
                                                                {new Date(chat.createdAt.seconds * 1000 + chat.createdAt.nanoseconds / 1000000).getMinutes().toString().padStart(2, "0")}</p>

                                                        </div>
                                                        :
                                                        ""}

                                                    <div className="outerimage">
                                                        {chat.photoURL != undefined ?
                                                            <img className="imageInChat" src={chat.photoURL} alt="" />

                                                            : ""}
                                                    </div>
                                                    {chat.postId!=undefined?
                                                    <div className="postPart">
                                                        <PostInChat props={chat.postId}/>
                                                    </div>:
                                                    ""}
                                                    {chat.sharedUserId?
                                                    <div className="profilePart">
                                                        <ProfileInChat props = {chat.sharedUserId}/>
                                                    </div>
                                                    :""}
                                                </div>
                                                :
                                                <div className="outer__right">
                                                    {chat.message != "" ?
                                                        <div className='right__bubble_chat'>
                                                            <p>{new Date(chat.createdAt.seconds * 1000 + chat.createdAt.nanoseconds / 1000000).getHours().toString().padStart(2, "0")}:
                                                                {new Date(chat.createdAt.seconds * 1000 + chat.createdAt.nanoseconds / 1000000).getMinutes().toString().padStart(2, "0")}</p>
                                                            <p className="chat-text">{chat.message}</p>
                                                        </div>
                                                        :
                                                        ""}
                                                    {chat.photoURL != undefined && chat.photoURL != ""?
                                                        <img className="imageInChat" src={chat.photoURL} alt="" />

                                                        : ""}
                                                    {chat.postId!=undefined?
                                                    <div className="postPart">
                                                        <PostInChat props={chat.postId}/>
                                                    </div>:
                                                    ""}
                                                    {chat.sharedUserId?
                                                    <div className="profilePart">
                                                        <ProfileInChat props = {chat.sharedUserId}/>
                                                    </div>
                                                    :""}
                                                </div>
                                            : ""
                                        : ""
                                )}
                            </div>
                            <div className="addMessage">
                                <input type="text" value={message}
                                    onChange={(e) => handleMessage(e.target.value)} />
                                <button onClick={() => sendChat(getUser().id)}>Send</button>
                                <button onClick={handleVideoCall}>vid call</button>
                                <label className="file">
                                    <button>
                                        <label htmlFor="inputTag" className="btn">Select Image</label>
                                    </button>
                                    <input id="inputTag" ref={photoFile} type="file" accept="image/png, image/gif, image/jpeg" onChange={(e) => uploadPhoto(e)} />
                                    {/* <span className="file-custom">asdasd</span> */}
                                </label>


                                {photoURL != "" ?
                                    <div className="uploadedImage">
                                        <img src={photoURL}></img>
                                        <button onClick={() => setPhotoURL("")}>remove</button>
                                    </div>
                                    :
                                    ""}
                            </div>

                        </div>
                    </div>
                </div>
            </>
            <Footer />
        </div>
    )
}