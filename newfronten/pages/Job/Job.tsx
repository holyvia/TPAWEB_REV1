import { UseCurrentTheme } from "../../lib/themeContext";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Widgets from "../Widgets/Widgets";
import { JobContent } from "./JobContent";

export function Job (){
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
                    <JobContent/>
                    <Widgets />
                </div>
            </>
        </div>
        </div>
    )
}