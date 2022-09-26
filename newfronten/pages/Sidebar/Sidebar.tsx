import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import Avatar from "@mui/material/Avatar";
import { UseCurrentUser } from "../../lib/userContext";
import blankProfile from '../../assets/blank-profile.png'
import { useQuery } from "@apollo/client"
import { USER } from "../../query/queries";

function Sidebar() {


  const { getUser } = UseCurrentUser()
  const currUser = getUser()
  const [viewCount, setViewCount] = useState(0)
  const { data, loading, refetch} = useQuery(USER, {
    variables: {
      id: getUser().id
    }
  })
  useEffect(()=>{
    refetch()
  },[])
  if (data && !loading) {



    return (
      <div className="sidebar">
        <div className="sidebar__top">
          <img
            src={data.user.photo_background ? data.user.photo_background : blankProfile}
            alt=""
          />
          <Avatar src={data.user.photo_profile ? data.user.photo_profile : blankProfile} className="sidebar__avatar">
          </Avatar>
          <h2>{data.user.name}</h2>
          <h3>{data.user.work}</h3>
          <h3>{data.user.education}</h3>
        </div>

        <div className="sidebar__stats">
          <div className="sidebar__stat">
            <p>Who viewed you</p>
            <p className="sidebar__statNumber">{data.user.view_profile != null ? data.user.view_profile.length : "0"}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
