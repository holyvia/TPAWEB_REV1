import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import blankProfile from "../../assets/blank-profile.png"
import { USER } from "../../query/queries";
import { useQuery } from "@apollo/client";
import "./ProfilePicFrom.css"

export function ProfilePicFrom(props: any) {
    const { data, loading } = useQuery(USER, {
        variables: {
            id: props.props.fromId
        }
    })
    const [message, setMessage] = useState('')
    useEffect(() => {
        if (props != undefined) {
            if (props.props != undefined) {
                // if (props.props.type != undefined) {

                    if (props.props.type == "askConnect") {
                        setMessage(" wants to connect");
                    }
                    else if (props.props.type == "chat") {
                        setMessage(" chats you");
                    }
                    else if (props.props.type == "postLiked") {
                        setMessage(" likes your post");
                    }
                    else if (props.props.type == "follow") {
                        setMessage(" follows you");
                    }
                    else if (props.props.type == "view") {
                        setMessage(" views you");
                    }
                // }
            }
            // console.log(props.props);


        }
    }, [props])
    if (data && !loading) {

        return (
            <div className="perNotif">

                <Avatar className="headerOption__icon" src={data.user.photo_profile ? data.user.photo_profile : blankProfile} ></Avatar>

                <div className="text">
                    <p>{data.user.name} {message}</p>
                </div>
            </div>
        )
    }
}