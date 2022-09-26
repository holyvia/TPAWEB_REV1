import { useMutation, useQuery } from "@apollo/client";
import { Avatar } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { UseCurrentUser } from "../../lib/userContext";
import { CONNECT, REMOVE_REQUEST, UNCONNECT, USER } from "../../query/queries";
import "./EachSearchRes.css"

export function EachSearchRes({ props }: { props: any }) {
    const [sendConnectFunc] = useMutation(CONNECT)
    const [unconnectFunc] = useMutation(UNCONNECT)
    const [removedFunc] = useMutation(REMOVE_REQUEST)
    const { getUser, setUserToStr } = UseCurrentUser()
    const [button, setButton] = useState("connect")
    const navigate = useNavigate()
    const [popUpSendMessage, setPopUpSendMessage] = useState("hidden")
    const [connectMessage, setConnectMessage] = useState('');
    console.log(getUser());
    const { data, loading } = useQuery(USER, {
        variables: {
            id: getUser().id
        }
    })

    useEffect(() => {
        console.log(getUser());
        setButton("connect");
        if(data && !loading){

            if (data.user.pending_request != null) {
                if (data.user.pending_request.includes(props.id)) {
                    setButton("pending")
                }
            }
            if (data.user.connected_user != null) {
                if (data.user.connected_user.includes(props.id)) {
                    setButton("unconnect")
                }
            }
        }
            console.log(button);
    }, [data])

    function handleConnect(e: any) {
        console.log(e);

        sendConnectFunc({
            variables: {
                id: getUser().id,
                requestedId: e.id
            }
        }).then(async (e) => {
            console.log("success");
            console.log(e);
            const a = await addDoc(collection(db, "users", props.id, "notif"),
                {
                    type: "askConnect",
                    message: getUser().name + " wants to connect with you.",
                    createdAt: new Date(),
                    photoProfile: getUser().photo_profile,
                    fromId: getUser().id
                })
            console.log(e.data.sendConnect.userNow);
            setUserToStr(e.data.sendConnect.userNow)
        }).catch((err) => {
            console.log(err);
            setPopUpSendMessage("hidden")
        })
    }

    function handleUnconnect(e: any) {
        unconnectFunc({
            variables: {
                id: getUser().id,
                unconnectedId: e.id
            }
        }).then((e) => {
            console.log("success");
            console.log(e.data.unconnect);
            setUserToStr(e.data.unconnect)
        })
    }

    function handleRemoveRequest(e: any) {
        // console.log(e.id);
        // console.log(getUser().id);

        removedFunc({
            variables: {
                id: getUser().id,
                removedRequestID: e.id
            }
        }).then((e) => {
            console.log("success");
            console.log(e.data.removeRequest);
            setUserToStr(e.data.removeRequest)
        })
    }

    async function handleSaveMessage() {
        const a = await addDoc(collection(db, "connect", props.id, "message"),
            {
                messageFrom: getUser().id,
                content: connectMessage
            }
        ).then(() => {
            handleConnect(props)
        })
    }
    if (data && !loading) {

        return (
            <div className="container__card" >
                <Avatar className="avatar" src={props.profile_photo} onClick={() => navigate(`/profile/${props.id}`)} />
                <div className="card__description">
                    <p className="name">{props.name}</p>
                    <p className="work">{props.work}</p>
                </div>
                <div className="connectClass">
                    {button == "connect" ? (
                        <button onClick={() => setPopUpSendMessage("popUpSendMessage")}>Connect</button>
                    ) : (
                        button == "unconnect" ? (
                            <button onClick={() => handleUnconnect(props)}>Unconnect</button>
                        ) : (
                            <button onClick={() => handleRemoveRequest(props)}>Pending</button>
                        )
                    )}
                    <div className={popUpSendMessage}>
                        <h4>Add Message</h4>
                        <textarea name="" id="" cols="30" rows="3" placeholder="message" value={connectMessage} onChange={(e) => setConnectMessage(e.target.value)}></textarea>
                        <button onClick={() => handleConnect(props)}>skip add message</button>
                        <button onClick={handleSaveMessage}>send with message</button>
                    </div>

                </div>
            </div>
        )
    }

}
