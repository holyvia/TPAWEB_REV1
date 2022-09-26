import { UseCurrentTheme } from "../../lib/themeContext";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Widgets from "../Widgets/Widgets";
import { NotificationContent } from "./NotificationContent";

export function Notification (){
    const {getTheme} = UseCurrentTheme()
    return(
        <div>
            <div className="app" style={{...getTheme()}}>
            <>
                <div className="header">
                <Header />
                </div>
                <div className="app__body">
                    <Sidebar />
                    <NotificationContent/>
                    <Widgets />
                </div>
            </>
        </div>
        </div>
    )
}