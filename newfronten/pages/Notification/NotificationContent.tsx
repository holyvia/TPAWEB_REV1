import { Avatar } from "@mui/material"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebase"
import { UseCurrentUser } from "../../lib/userContext"
import blankProfile from "../../assets/blank-profile.png"
import "../Feed/Feed.css";
import { USER } from "../../query/queries"
import { useLazyQuery } from "@apollo/client/react"
import { ProfilePicFrom } from "./ProfilePicFrom"

export function NotificationContent(){
    const {getUser} = UseCurrentUser()
    const [notifs, setNotifs] = useState([])
    const [getUserFunc, {data, loading, refetch}] = useLazyQuery(USER)
    function getComments(){
        const q = query(collection(db,"users",getUser().id, "notif"), orderBy("createdAt", "desc"))
        onSnapshot(q, (docs)=>{
            let array:any=[]
            docs.forEach(doc=>{
                array.push({...doc.data(),id:doc.id})
            })
            setNotifs(array)
        })
    }
    useEffect(()=>{
        getComments()
    },[])
    useEffect(()=>{

    },[notifs])
    return (
        <div className="feed">
                {notifs.map((item:any) => (
                    <div className="notifOuter">
                        <hr />

                   <div className="eachNotif">
                    <ProfilePicFrom props={item}/>
                   </div>     
                    </div>
                   
                    )
                    )
                }
                
            </div>
    )
}