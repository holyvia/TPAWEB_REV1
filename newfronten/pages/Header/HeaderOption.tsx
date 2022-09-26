import React, { useState } from "react";
import "./HeaderOption.css";
import Avatar from "@mui/material/Avatar";
import { UseCurrentUser } from "../../lib/userContext";
import blankProfile from "../../assets/blank-profile.png"

function HeaderOption({ avatar, Icon, title, onClick }:{avatar:any, Icon:any, title:any, onClick:any}) {
  const { getUser, setUserToStr } = UseCurrentUser()
  const [user, setUser] = useState(getUser())
  return (
    <div onClick={onClick} className="headerOption">
      {Icon && <Icon className="headerOption__icon" />}
      {avatar && (
        <Avatar className="headerOption__icon" src={user.photo_profile?user.photo_profile:blankProfile} >
          {/* {user?.email?.[0]} */}
        </Avatar>
      )}
      <h3 className="headerOption__title">{title}</h3>
    </div>
  );
}

export default HeaderOption;
