import { useMutation } from "@apollo/client";
import { Avatar } from "@mui/material";
import { addDoc, collection, onSnapshot, query , getDocs} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { UseCurrentUser } from "../../lib/userContext";

export function  SearchRes({ props }: { props: any }){

    const { getUser, setUserToStr } = UseCurrentUser()
    const [button, setButton] = useState("connect")
    const [currentRooms, setRooms] = useState([{}])
    const navigate = useNavigate()
    console.log(getUser());
    const id = props.id
    const [count, setCount] =useState(0)
    async function handleMessage() {
        const q = query(collection(db, "rooms"))
        let array = [{}]
        // console.log(id);
        // setRooms([{}])
        // setCount(0)
        const docs = await getDocs(q);
            docs.forEach(doc => {
                // log
                if(doc){
                    
                    if (doc.data().users_id.includes(id) && doc.data().users_id.includes(getUser().id)){
                        array.push({ ...doc.data(), id: doc.id })
                        setRooms(array)
                        // setCount(count+1)
                    }
                }
            })
        // console.log("count:"+count);
        console.log(array.length);
        
            if(array.length<=1){
                 addDoc(collection(db, "rooms"), {
                users_id: [getUser().id, id]
            }).then((e) => {
                navigate('/message/' + id)
                console.log(e);
            })
                
            }
            else{
                navigate('/message/' + id)
            }
        
        // console.log(currentRooms);
        
        // if (currentRooms[1]!=undefined) {
        //     navigate('/message/' + id)
        // }
        // else {
        //     addDoc(collection(db, "rooms"), {
        //         users_id: [getUser().id, id]
        //     }).then((e) => {
        //         navigate('/message/' + id)
        //         console.log(e);
        //     })
        // }
    }
    useEffect(()=>{
        console.log(currentRooms.length);
        if(currentRooms.length>1){
            navigate('/message/' + id)
        }
    }, [currentRooms])
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


    return(
        <div className="container__card" onClick={handleMessage}>
            <Avatar className="avatar" src={props.profile_photo} />
            <div className="card__description">
                <p className="name">{props.name}</p>
                <p className="work">{props.work}</p>
            </div>
        </div>
    )
}

