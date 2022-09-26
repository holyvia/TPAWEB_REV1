import ProfileCard from "./ProfileCard";
import './Invitations.css'
import { useQuery } from "@apollo/client";
import { UseCurrentUser } from "../../lib/userContext";
import { useEffect, useState } from "react";
import { USER } from "../../query/queries";
export default function Invitations() {
    const { getUser } = UseCurrentUser()
    const {data, loading} = useQuery(USER,{
        variables:{
            id:getUser().id
        }
    })
    const [invitations, setInvitations] = useState([])
    useEffect(()=>{
        if(data){
            setInvitations(data.user.request_connect)
        }
    },[data])

    if (data && !loading) {
        
        console.log(invitations);
        
        return (
            <div className="container__invitations">
                <div className='container__header'>
                    <p>Invitations</p>
                    <button>Manage</button>
                </div>
                <div className='container__cards'>
                    {invitations != null ? (invitations.map((inv: any) => (
                        <div>
                            <hr />
                            <ProfileCard props={inv} />
                        </div>
                    ))) : ("")}
                </div>
            </div>
        )
    }
    return ("")
}