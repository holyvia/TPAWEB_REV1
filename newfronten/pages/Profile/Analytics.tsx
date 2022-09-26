import { useEffect, useState } from "react";
import "./Analytics.css"
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import { UseCurrentUser } from "../../lib/userContext";
import { useQuery } from '@apollo/client';
import { USER } from "../../query/queries";

export default function Analytics(props: any) {
    const [viewsCount, setViewCount] = useState(34)
    const [searchedCount, setSearchedCount] = useState(10)
    const { getUser } = UseCurrentUser()


    useEffect(() => {
        if (props != undefined) {
            if (props.props != undefined) {
                if (props.props.user != undefined) {
                    if(props.props.user.view_profile!=null)
                    console.log(props.props.user.view_profile.length);

                    if (props.props.user.view_profile != null) {
                        setViewCount(props.props.user.view_profile.length)
                    }
                    else {
                        setViewCount(0)
                    }
                }
            }
        }
        console.log(props);
        

    }, [props])
    // console.log(props);


    return (
        <div className="analytics">
            <h2>Analytics</h2>
            <div className="private__line">
                <RemoveRedEyeIcon style={{ color: "grey", fontSize: "1rem", marginTop: "0.1rem", marginRight: "0.2rem" }} /><p>private to you</p>
            </div>
            <div className="analytics__contents">
                <div className="analytics__content">
                    <PeopleIcon style={{ fontSize: "1.5rem", marginTop: "0.1rem", marginRight: "0.5rem" }} />
                    <div className="text__content">
                        <h4>{viewsCount} profile views</h4>
                        <p>Discover who's viewed your profile.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}