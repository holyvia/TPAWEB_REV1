import React, { useState } from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import HeaderOption from "./HeaderOption";
import HomeIcon from "@mui/icons-material/Home";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ProfileDropdown from "./ProfileDropdown";
import { useNavigate } from "react-router-dom";
import { UseCurrentTheme } from "../../lib/themeContext";
import { UseCurrentUser } from "../../lib/userContext";
import logo from '../../assets/smallLogo.png'
// import { useDispatch } from "react-redux";
// import { logout } from "./features/userSlice";
// import { getAuth, signOut } from "./firebase";

function Header() {
  const [dropdownClassName,setDropdownClassName] = useState("invisibleDropdown")
  const navigate = useNavigate()
  const [subString, setSubString] = useState('')
  const {getUser} = UseCurrentUser()
  const  user = getUser()
  
  function toggleDropdown(){
    if(dropdownClassName == "invisibleDropdown"){
      setDropdownClassName("dropdown")
    }
    else{
      setDropdownClassName("invisibleDropdown")
    }
  }

  function goToSearch(){
    navigate(`/search/${subString}`)
    // console.log();
    
  }

  return (
  <div className="header__outer">
    <div className="header">
      <div className="header__left">
        <img
          src={logo}
          alt=""
        />

        <div className="header__search">
          <div className="searchButton" onClick={goToSearch}>
            <SearchIcon />
          </div>
          <input placeholder="Search" type="text" value={subString} onChange={(e)=>{setSubString(e.target.value)}}/>
        </div>
      </div>

      <div className="header__right">
        <HeaderOption Icon={HomeIcon} title="Home" avatar={undefined} onClick={()=>{navigate('/homepage')}}/>
        <HeaderOption Icon={SupervisorAccountIcon} title="My Network" avatar={undefined} onClick={()=>{navigate('/network')}}/>
        <HeaderOption Icon={BusinessCenterIcon} title="Jobs" avatar={undefined} onClick={()=>navigate('/job')}/>
        <HeaderOption Icon={ChatIcon} title="Message" avatar={undefined} onClick={()=>navigate('/message')}/>
        <HeaderOption Icon={NotificationsIcon} title="Notifications" avatar={undefined} onClick={()=>navigate('/notification')}/>
        <HeaderOption avatar={true} title="me" onClick={toggleDropdown} Icon={undefined}/>
      </div>

    </div>
     <div className={dropdownClassName}>
     <ProfileDropdown/>
   </div>
  </div>
  );
}

export default Header;
