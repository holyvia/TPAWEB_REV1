import { CurrentThemeProvider, UseCurrentTheme } from "../../lib/themeContext";
import Feed from "../Feed/Feed";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Widgets from "../Widgets/Widgets";
import "./Homepage.css"

export default function Homepage() {
    const {getTheme, changeTheme} = UseCurrentTheme()

    console.log(getTheme());

    console.log(localStorage.getItem('theme'));
    
    
    return (
        <div className="app" style={{...getTheme()}}>
            <>
                <div className="header">
                <Header />
                </div>
                <div className="app__body">
                    <Sidebar />
                    <Feed />
                    <Widgets />
                </div>
            </>
        </div>
    )
}

