import { useLazyQuery, useQuery } from "@apollo/client";
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseCurrentUser } from "../../lib/userContext";
import { USER } from "../../query/queries";
import "./PersonContainer.css"

export default function PeopleContainer({ props }: { props: any }) {
    const { getUser } = UseCurrentUser()
    const [nonCurrUser, setNonCurrUser] = useState("")

    useEffect(() => {
        if (props != null) {
            for (let index = 0; index < props.users_id.length; index++) {
                if (props.users_id[index] != getUser().id)
                    setNonCurrUser(props.users_id[index])
            }
        }
    }, [props])

    const [getUserFunc, { data, loading }] = useLazyQuery(USER)
    useEffect(() => {
        getUserFunc({
            variables: {
                id: nonCurrUser
            }
        })
    }, [nonCurrUser])

    const navigate = useNavigate()
    function handleClick() {
        navigate('/message/' + data.user.id)
    }
    
    return (
        <>
            {data ? <>
                <div className="personContainer" onClick={() => handleClick()}>
                    <Avatar src={data.user.photo_profile}/>
                    <p>{data.user.name}</p>
                </div>
                <hr />
            </> : ""}
        </>
    )
}