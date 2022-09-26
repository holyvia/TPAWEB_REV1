import React from "react";
import "./Widgets.css";
import InfoIcon from "@mui/icons-material/Info";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { UseCurrentTheme } from "../../lib/themeContext";
import { useNavigate } from "react-router-dom";

function Widgets() {
  const navigate = useNavigate()
  const newArticle = (heading:string, subtitle:string) => (
    <div className="widgets__article">
      <div className="widgets__articleLeft">
        <FiberManualRecordIcon />
      </div>
      <div className="widgets__articleRight">
        <h4>heading</h4>
        <p>subtitle</p>
      </div>
    </div>
  );

  function handleSignout(){
    localStorage.removeItem('user')
    window.location.reload()
  }
  // const {getTheme} = UseCurrentTheme()
  return (
    <div >

    <div className="widgets">
      <div className="widgets__header">
        <h2>LinkedIn News</h2>
        <InfoIcon className="infoIcon"/>
      </div>

    </div>
        <div className="footer">
            <p onClick={()=>window.open('https://about.linkedin.com/')}>About</p>
            <p onClick={()=>window.open('https://www.linkedin.com/accessibility?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BLXJL0s0lQr%2B5cYuGccc9dg%3D%3D')}>Accesbility</p>
            <p onClick={()=>window.open('https://www.linkedin.com/help/linkedin/answer/62931?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BLXJL0s0lQr%2B5cYuGccc9dg%3D%3D')}>Ad Choices</p>
            <p onClick={()=>window.open('https://mobile.linkedin.com/')}>Mobile</p>
            <p onClick={()=>window.open('https://business.linkedin.com/sales-solutions?trk=flagship_nav&veh=li-footer-lss-control&src=li-footer')}>Sales Solution</p>
        </div>
    </div>
  );
}

export default Widgets;