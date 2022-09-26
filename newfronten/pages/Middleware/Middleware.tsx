
import { Navigate, useNavigate } from "react-router-dom";
import { UseCurrentUser } from "../../lib/userContext";

export function ProtectedRoute({children}:any){
    const {getUser}= UseCurrentUser()
    const user = getUser()
    // const navigate = useNavigate()
    // console.log(user);
    
    if(Object.keys(user).length===0){
        return <Navigate to="/"/>
    }
    return children;
}

export function UnprotectedRoute({children}:any){
    const {getUser}= UseCurrentUser()
    const user = getUser()
    if(Object.keys(user).length!==0){
        return <Navigate to="/homepage"/>
    }
    return children;
}