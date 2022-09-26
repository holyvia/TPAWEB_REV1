import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { log } from "console";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseCurrentTheme } from "../../lib/themeContext";
import { ACTIVATE_ACC, GET_ACTIVATE_LINK } from "../../query/queries";
import Header from "../Header/Header";
import "../Homepage/Homepage.css"

export function ActAccount() {
    const { getTheme } = UseCurrentTheme()
    const { id } = useParams()
    const [actv] = useMutation(ACTIVATE_ACC)
    const navigate = useNavigate()
    const [getActivateLink, { called, data, loading}] = useLazyQuery(GET_ACTIVATE_LINK, {
        variables: {
            id: id
        }
    })

    useEffect(()=>{
        if(id!=null && id!=undefined && !called){
            getActivateLink()
        }
    },[id])
    useEffect(()=>{
        if(data){
            console.log(data);
        }
    },[data])
    // if (!loading && data!=undefined) {
    //     console.log(data.getLink);
    // }
    // else{
    //     console.log(error);

    // }

    function activate() {
        if (!loading && data != undefined) {
            console.log(data)
            actv({
                variables: {
                    id: data.getLink.userId
                }
            }).then(() => {
                navigate('/')
            }).catch((err) => {
                console.log(err);
            })
        }

    }

    return (
        <div className="app" style={{ ...getTheme() }}>
            <>
                <div className="app__body">
                    <button type="button" onClick={activate}>
                        Activate account
                    </button>
                </div>
            </>
        </div>
    )
}