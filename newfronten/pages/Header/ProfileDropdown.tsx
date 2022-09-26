import Avatar  from "@mui/material/Avatar"
import { useNavigate } from "react-router-dom"
import { UseCurrentUser } from "../../lib/userContext"
import "./ProfileDropdown.css"
import blankProfile from "../../assets/blank-profile.png" 
import { UseCurrentTheme } from "../../lib/themeContext"

export default function ProfileDropdown(){
    const navigate = useNavigate()
    const {getUser} = UseCurrentUser()
    const currUser = getUser()
    const {changeTheme} = UseCurrentTheme()
    // console.log(currUser);
    
    function handleSignOut(){
        localStorage.removeItem('user')
        window.location.reload()
    }

    return(
        <div className="profile__dropdown">
            <div className="profile__content">
                <Avatar src={currUser.photo_profile?currUser.photo_profile:blankProfile}>

                </Avatar>
                <div className="profile__text">
                    <h3>{currUser.name}</h3>
                    {currUser.work?(<p>{currUser.work}</p>):("")}
                </div>
            </div>
            <button onClick={()=>navigate('/profile')}>
                View Profile
            </button>
            <div className="signout">
                <h4>Account</h4>
                <p onClick={handleSignOut}>Sign Out</p>
                <p onClick={changeTheme}>Change Theme</p>
            </div>
        </div>
    )
}