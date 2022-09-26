import { useQuery } from "@apollo/client";
import { Avatar } from "@mui/material";
import { USER } from "../../query/queries";


export default function HoverProfile({ currUser }: { currUser: any }) {
    const { data } = useQuery(USER, {
        variables: {
            id: currUser
        }
    })

    return (
        <>
            {data ?
                <div className="hover_profile__container">
                    <div className="profile__content">
                        <Avatar className='avatar' src={data.user.photo_profile}>

                        </Avatar>
                        <div className="profile__text">
                            <h3>{data.user.name}</h3>
                            {data.user.work ? (
                                <p>{data.user.work}</p>
                            ) : (
                                ""
                            )}

                        </div>
                    </div>
                </div>
                : ""}
        </>
    )
}