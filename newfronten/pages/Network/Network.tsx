import Header from "../Header/Header";
import Invitations from "./Invitations";
import "../Homepage/Homepage.css"
import { UseCurrentTheme } from "../../lib/themeContext";
import { UserYouMightKnow } from "./UserYouMightKnow";
import Widgets from "../Widgets/Widgets";

export default function Network() {
    const { getTheme, changeTheme } = UseCurrentTheme()
    return (
        <div className="app" style={{ ...getTheme() }}>
                <Header />
       

                    <div className="network__content">
                        <div className='app__body1'>
                            <Invitations />
                        </div>
                        <div className='app__body1'>
                            <UserYouMightKnow />
                        </div>
                    </div>
                    <div className="footer1">
                        <p onClick={()=>window.open('https://about.linkedin.com/')}>About</p>
                        <p onClick={()=>window.open('https://www.linkedin.com/accessibility?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BLXJL0s0lQr%2B5cYuGccc9dg%3D%3D')}>Accesbility</p>
                        <p onClick={()=>window.open('https://www.linkedin.com/help/linkedin/answer/62931?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BLXJL0s0lQr%2B5cYuGccc9dg%3D%3D')}>Ad Choices</p>
                        <p onClick={()=>window.open('https://mobile.linkedin.com/')}>Mobile</p>
                        <p onClick={()=>window.open('https://business.linkedin.com/sales-solutions?trk=flagship_nav&veh=li-footer-lss-control&src=li-footer')}>Sales Solution</p>
                    </div>
        </div>

    )
}