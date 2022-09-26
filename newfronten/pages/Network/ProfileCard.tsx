import { useMutation, useQuery } from "@apollo/client";
import Avatar from "@mui/material/Avatar";
import { UseCurrentUser } from "../../lib/userContext";
import { ACCEPT, IGNORE, USER } from "../../query/queries";
import './ProfileCard.css'
import blankProfile from '../../assets/blank-profile.png'
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";


export default function ProfileCard({ props }: { props: any }) {

    const { data, loading, error } = useQuery(USER, {
        variables: {
            id: props
        }
    })
    const [accFunc] = useMutation(ACCEPT)
    const [ignFunc] = useMutation(IGNORE)
    const [message, setMessage] = useState('')
    const { getUser, setUserToStr } = UseCurrentUser()
    function handleAccept() {
        accFunc({
            variables: {
                id: getUser().id,
                acceptedId: data.user.id
            }
        }).then((e) => {
            console.log(e.data.acceptConnect);
            setUserToStr(e.data.acceptConnect);
        }).catch((err) => {
            console.log(err);
        })
    }

    function handleIgnore() {
        ignFunc({
            variables: {
                id: getUser().id,
                ignoredId: data.user.id
            }
        }).then((e) => {
            console.log(e.data);
            setUserToStr(e.data.ignoreConnect);
        }).catch((err) => {
            console.log(err);
        })
    }

    async function getConnectMessage() {
        const q = query(collection(db, "connect", getUser().id, "message"))
        onSnapshot(q, (docs) => {
            docs.forEach(doc => {
                if (doc.data().messageFrom == data.user.id) {
                    setMessage(doc.data().content)
                }
            })
        })

    }

    useEffect(() => {
        if (data) {
            getConnectMessage()
        }
    }, [data])

    if (data) {

        return (
            <div className="outer_card">
                <div className="container__card">
                    <Avatar className='profile__photo' src={data.user.photo_profile ? data.user.photo_profile : blankProfile}></Avatar>
                    <div className="card__description">
                        <p className="name">{data.user.name}</p>
                        <p className="work">{data.user.work}</p>
                        {
                            message != "" ?
                                <div className="message">
                                    <p>message: </p>
                                    <p>{message}</p>
                                </div> :
                                ""
                        }
                        <button onClick={handleIgnore}>Ignore</button>
                        <button onClick={handleAccept}>Accept</button>
                    </div>
                </div>

            </div>
        )
    }
}