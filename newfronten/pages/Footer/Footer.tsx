import "./Footer.css"
export function Footer(){
    return (
        <footer>
            <p onClick={()=>window.open('https://about.linkedin.com/')}>About</p>
            <p onClick={()=>window.open('https://www.linkedin.com/accessibility?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BLXJL0s0lQr%2B5cYuGccc9dg%3D%3D')}>Accesbility</p>
            <p onClick={()=>window.open('https://www.linkedin.com/help/linkedin/answer/62931?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BLXJL0s0lQr%2B5cYuGccc9dg%3D%3D')}>Ad Choices</p>
            <p onClick={()=>window.open('https://mobile.linkedin.com/')}>Mobile</p>
            <p onClick={()=>window.open('https://business.linkedin.com/sales-solutions?trk=flagship_nav&veh=li-footer-lss-control&src=li-footer')}>Sales Solution</p>
        </footer>
    )
}