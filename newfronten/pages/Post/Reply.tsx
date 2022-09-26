import { UseCurrentUser } from "../../lib/userContext"
import { useQuery } from '@apollo/client'
import { USER } from "../../query/queries"
import { Avatar } from "@mui/material"
import { useEffect } from "react"
import blankProfile from "../../assets/blank-profile.png"
import './Reply.css'
export function Reply(props: any) {
    const { data, loading } = useQuery(USER, {
        variables: {
            id: props.props.userId
        }
    })
    useEffect(() => {
        if (props != undefined) {
            console.log(props);
        }

    }, [])

    if (data && !loading) {


        return (
            <div className="reply">
                <div className="identity">
                    <Avatar src={data.user.photo_profile ? data.user.photo_profile : blankProfile} />
                    <div className="text">

                        <h4>{data.user.name}</h4>
                        <p>{props.props.comment}</p>
                    </div>
                </div>

            </div>
        )
    }
}