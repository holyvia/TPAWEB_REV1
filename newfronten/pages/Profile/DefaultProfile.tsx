import Avatar from '@mui/material/Avatar'
import { useEffect, useRef, useState } from 'react'
import { UseCurrentUser } from '../../lib/userContext'
import EditProfilePopUp from '../EditProfilePopUp/EditProfilePopUp'
import './DefaultProfile.css'
import blankProfile from '../../assets/blank-profile.png'
import { useMutation, useQuery, useLazyQuery } from '@apollo/client'
import { BLOCK_USER, CONNECT, FOLLOW, SEARCH_CONNECT_USER, UNCONNECT, UNFOLLOW, USER } from '../../query/queries'
import { addDoc, collection, getDocs, onSnapshot, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { useNavigate, useParams } from 'react-router-dom'
import ProfileInPDF from './ProfileInPDF'
import { useReactToPrint } from 'react-to-print'
import toast, { Toaster } from 'react-hot-toast'
// import {}
interface propsAndRefetch {
    refetch: () => any
    props: any
}
export default function DefaultProfile({ props, refetch }: propsAndRefetch) {
    const { getUser, setUserToStr } = UseCurrentUser()
    const currUser = getUser()
    const [conectionCount, setConnectionCount] = useState(0)
    const [editProfilePopUp, setProfilePopUp] = useState("editProfilePopUpNone")
    const [followFunc] = useMutation(FOLLOW)
    const [unfollowFunc] = useMutation(UNFOLLOW)
    const [blockFunc] = useMutation(BLOCK_USER)
    const [unconnectFunc] = useMutation(UNCONNECT)
    const [rooms, setRooms] = useState([])
    const [currentRooms, setCurrentRooms] = useState([{}])
    const [sendConnectFunc] = useMutation(CONNECT)
    const [sendComponent, setSendComponent] = useState("hidden")
    const [roomID, setRoomID] = useState("")
    const [sendMessage, setSendMessage] = useState("")
    const { data: currUserData, loading: currUserLoading } = useQuery(USER, {
        variables: {
            id: getUser().id
        }
    })
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const [searchConnectFunc, { data: getConnectUserData, loading: getConnectUserLoading, refetch: refetchSearchResult }] = useLazyQuery(SEARCH_CONNECT_USER)

    const [subStringConnectSearch, setSubStringConnectSearch] = useState("")

    function togglePopUp() {
        if (editProfilePopUp == "editProfilePopUp") {
            setProfilePopUp("editProfilePopUpNone")
        }
        else {
            setProfilePopUp("editProfilePopUp")
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
            if (room.users_id.includes(userId) && room.users_id.includes(getUser().id)) {
                setRoomID(room.id)
            }
        })

        if (roomID == "") {
            await addDoc(collection(db, "rooms"), {
                users_id: [getUser().id, userId]
            }).then(async (e) => {
                await addDoc(collection(db, "rooms", e.id, "chats"), {
                    message: sendMessage,
                    createdAt: new Date(),
                    sender: getUser().id,
                    sharedUserId: id
                }).then(async (e) => {
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
                                }), {
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
                sharedUserId: id
            }).then(async (e) => {
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
                            }), {

                        loading: "Sending",
                        success: "Sent",
                        error: "Error"

                    }
                    )
                    setSendComponent("hidden")
                }

            })
        }
        console.log("Profile Sent");
        
    }

    // useEffect(()=>{
    //     console.log(currentRooms.length);
    //     if(currentRooms.length>1){
    //         navigate('/message/' + id)
    //     }
    // }, [currentRooms])

    function handleNavigate() {
        console.log();
        // else {
        addDoc(collection(db, "rooms"), {
            users_id: [getUser().id, id]
        }).then((e) => {
            navigate('/message/' + id)
            console.log(e);
        })
        // }
    }
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
    
    async function handleMessage() {
        const q = query(collection(db, "rooms"))
        let array = [{}]
        // console.log(id);
        // setRooms([{}])
        const docs = await getDocs(q);
        docs.forEach(doc => {
            // log
            if (doc) {

                if (doc.data().users_id.includes(id) && doc.data().users_id.includes(getUser().id)) {
                    array.push({ ...doc.data(), id: doc.id })
                    // setCurrentRooms(array)
                    // setCount(count+1)
                }
            }
        })
        if (array.length <= 1) {
            addDoc(collection(db, "rooms"), {
                users_id: [getUser().id, id]
            }).then((e) => {
                navigate('/message/' + id)
                console.log(e);
            })

        }
        else {
            navigate('/message/' + id)
        }
        // console.log("count:"+count);
        //     if(count==0){
        //         handleNavigate()
        //         console.log("mau create rooom");

        //     }
    }

    function handleFollow() {
        followFunc({
            variables: {
                id: getUser().id,
                followedId: props.user.id
            }
        }).then(async (e) => {
            console.log(e.data);
            setUserToStr(e.data.follow);
            await addDoc(collection(db, "users", props.user.id, "notif"),
                {
                    type: "follow",
                    message: getUser().name + " follows you.",
                    createdAt: new Date(),
                    photoProfile: getUser().photo_profile,
                    fromId: getUser().id
                })
        }).catch((err) => {
            console.log(err);
        })
    }
    function handleUnfollow() {
        unfollowFunc({
            variables: {
                id: getUser().id,
                unfollowedId: props.user.id
            }
        }).then((e) => {
            console.log(e.data);
            setUserToStr(e.data.unfollow);
        }).catch((err) => {
            console.log(err);
        })
    }

    function handleConnect(e: any) {
        console.log(e);

        sendConnectFunc({
            variables: {
                id: getUser().id,
                requestedId: e.id
            }
        }).then((e) => {
            console.log("success");
            console.log(e);

            console.log(e.data.sendConnect.userNow);
            setUserToStr(e.data.sendConnect.userNow).then(async () => {
                const a = await addDoc(collection(db, "users", props.id, "notif"),
                    {
                        type: "askConnect",
                        message: getUser().name + " wants to connect with you.",
                        createdAt: new Date(),
                        photoProfile: getUser().photo_profile,
                        fromId: getUser().id
                    })
            })

        }).catch((err) => {
            console.log(err);
        })
    }
    function handleBlock(){
        blockFunc({
            variables:{
                id:getUser().id,
                blockedId:id
            }
        }).then(()=>{
            unfollowFunc({
                variables:{
                    id:getUser().id,
                    unfollowedId:id
                }
            })
        }).then(()=>{
            unfollowFunc({
                variables:{
                    id:id,
                    unfollowedId:getUser().id
                }
            })
        }).then(()=>{
            unconnectFunc({
                variables:{
                    id:id,
                    unconnected:getUser().id
                }
            })
        }).then(()=>{
            unconnectFunc({
                variables:{
                    id:getUser().id,
                    unconnected:id
                }
            })
        }).then(()=>{
            console.log("blocked");
            
            navigate('/homepage')
        })
        
       
        
        
        
    }
    const { id } = useParams()
    const navigate = useNavigate()
    //     const q = query(collection(db, "rooms"))
    //     let array = [{}]
    //     onSnapshot(q, (docs) => {

    //         docs.forEach(doc => {

    //             if (doc.data().users_id.includes(id) && doc.data().users_id.includes(getUser().id))
    //                 array.push({ ...doc.data(), id: doc.id })
    //         })
    //     })

    // function handleNavigate(array: any) {
    //     console.log(currentRooms.length);

    //     if (currentRooms.length <= 1) {
    //         navigate('/message/' + id)
    //     }
    //     else {
    //         addDoc(collection(db, "rooms"), {
    //             users_id: [getUser().id, id]
    //         }).then((e) => {
    //             navigate('/message/' + id)
    //             console.log(e);
    //         })
    //     }
    // }
    useEffect(() => {
        if (props != undefined) {
            if (props.user != undefined) {
                if (props.user.connected_user != null) {
                    setConnectionCount(props.user.connected_user.length)
                }
            }
        }
    }, [props])

    if (props.user.id != getUser().id && currUserData && currUser) {
        console.log(props.user.name);
        console.log(props.user.id);

        return (
            <div className='default__profile'>
                <Toaster position='top-center' />
                <div className='profile_in_pdf' ref={componentRef}>
                    <ProfileInPDF props={props.user} />
                </div>
                <div className={editProfilePopUp}>
                    <EditProfilePopUp />
                </div>
                <div className="cover__photo">
                    <img src={props.user.photo_background ? props.user.photo_background : blankProfile} alt="" />
                </div>

                <Avatar className='profile__photo' src={props.user.photo_profile ? props.user.photo_profile : blankProfile}></Avatar>
                <h3>{props.user.name}</h3>
                <h4>{props.user.work}</h4>
                <h4>{props.user.education}</h4>
                <div className='sub__information'>
                    <p>{props.user.address}</p>
                    <p className='mid__dot'> . </p>
                    <p className='contact__info'>Contact info</p>
                </div>
                <p className='connection'>{conectionCount} Connection</p>
                <div className="buttons">
                    {currUserData.user.followed_user == null ?
                        <button onClick={handleFollow}>follow</button> :
                        (currUserData.user.followed_user.includes(props.user.id) ?
                            <button onClick={handleUnfollow}>unfollow</button> :
                            (<button onClick={handleFollow}>follow</button>))}
                    {currUserData.user.connected_user == null ?
                        ("") :
                        (currUserData.user.connected_user.includes(props.user.id) ?
                            <button onClick={handleMessage}>Message</button> :
                            (currUserData.user.pending_request == null ?
                                <button onClick={() => handleConnect(props.user)}>connect</button> :
                                currUserData.user.pending_request.includes(props.user.id) ?
                                    <button>pending</button> :
                                    <button onClick={() => handleConnect(props.user)}>connect</button>))}
                    <button className='save__btn' onClick={handlePrint} >Save as pdf</button>
                    <button onClick={handleBlock}>Block</button>
                    <button onClick={()=>setSendComponent("sendComponent")}>Share</button>
    
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
        )
    }
    else {
        return (
            <div className='default__profile'>
                <div className='profile_in_pdf' ref={componentRef}>
                    <ProfileInPDF props={currUser} />
                </div>
                <div className={editProfilePopUp}>
                    <EditProfilePopUp />
                </div>
                <div className="cover__photo">
                    <img src={currUser.photo_background ? currUser.photo_background : blankProfile} alt="" />
                </div>
                <Avatar className='profile__photo' src={currUser.photo_profile ? currUser.photo_profile : blankProfile}></Avatar>
                <h3>{currUserData.user.name}</h3>
                <h4>{currUserData.user.work}</h4>
                <h4>{currUserData.user.education}</h4>
                <div className='sub__information'>
                    <p>{currUser.address}</p>
                    <p className='mid__dot'> . </p>
                    <p className='contact__info'>Contact info</p>
                </div>
                <p className='connection'>{conectionCount} Connection</p>
                <div className="buttons">
                    <button className='add__exp__btn' onClick={togglePopUp}>Edit Profile</button>
                    <button className='save__btn' onClick={handlePrint} >Save as pdf</button>
                </div>
            </div>
        )
    }
}