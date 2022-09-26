import { useQuery, useMutation } from "@apollo/client";
import { addDoc, collection } from "firebase/firestore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { UseCurrentTheme } from "../../lib/themeContext";
import { UseCurrentUser } from "../../lib/userContext";
import { USER, VIEW_PROFILE } from "../../query/queries";
import EditProfilePopUp from "../EditProfilePopUp/EditProfilePopUp";
import Header from "../Header/Header";
import MainProfile from "./MainProfile";
import "./Profile.css"


export default function Profile() {
    const { id } = useParams()
    const { getUser } = UseCurrentUser()
    const { getTheme, changeTheme } = UseCurrentTheme()
    const { data, loading, error, refetch } = useQuery(USER, {
        variables: {
            id: id
        }
    })
    const { data: currentUserData, loading: currentUserLoading, refetch: refetchCurrrent } = useQuery(USER, {
        variables: {
            id: getUser().id
        }
    })
    const [viewFunction] = useMutation(VIEW_PROFILE)

    async function createNotifView() {
        if (id != undefined) {
            const a = await addDoc(collection(db, "users", id, "notif"),
                {
                    type: "view",
                    message: getUser().name + " views you.",
                    createdAt: new Date(),
                    photoProfile: getUser().photo_profile,
                    fromId: getUser().id
                })
        }
    }

    useEffect(() => {
        if (id != undefined) {
            viewFunction({
                variables: {
                    id: getUser().id,
                    viewedId: id
                }
            }).then((e) => {
                console.log(e);
                createNotifView();
            })

        }

    }, [id])

    if (data) {

        return (
            <div style={{ ...getTheme() }}>
                <div className="app">
                    <>
                        <Header />
                        <div className="profile" >
                            <MainProfile props={data} refetch={refetchCurrrent} />
                        </div>
                    </>
                </div>
            </div>
        )
    }
    else if (currentUserData) {
        return (
            <div style={{ ...getTheme() }}>
                <div className="app">
                    <>
                        <Header />
                        <div className="profile" >
                            <MainProfile props={currentUserData} refetch={refetch} />
                        </div>
                    </>
                </div>
            </div>
        )
    }
}