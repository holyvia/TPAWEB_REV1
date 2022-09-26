import { useLazyQuery, useMutation } from "@apollo/client"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { UseCurrentTheme } from "../../lib/themeContext"
import { CREATE_LINK, USER, USER_BY_EMAIL } from "../../query/queries"
import { Footer } from "../Footer/Footer"

export function InputEmailResetPass(){
    const {getTheme} = UseCurrentTheme()
    const [email, setEmail] = useState('')
    const [SendResetLink] = useMutation(CREATE_LINK)
    const navigate = useNavigate()
    const [getUserByEmail, {data, loading}] = useLazyQuery(USER_BY_EMAIL)

    function sendResetLinkFunc(){
        getUserByEmail({
            variables:{
                email: email
              }
        }).then((e)=>{
            if(e.error!=undefined){
                if(e.error.toString().split(":")[1] == " record not found"){
                    toast.error("Email is not found")
                }
            }
            else{
                SendResetLink({
                    variables: {
                        userEmail:email
                    }
                }).then(() => {
                    toast.success("Reset email is sent")
                }).catch((err) => {
                    console.log(err);
                    toast.error("Email is not found")
                })
            }        
        })
       
    }

    return(
        <div className="app" style={{...getTheme()}}>
            <>
                <div className="app__body" >
                <Toaster position="top-center"/>
                    
                    <div className="inputNewPassword">
                        <h2>Input email to be reset</h2>
                        <div className="innerInput" style={{"paddingTop":"0.6rem", "paddingBottom":"0.5rem"}}>
                            <label>
                                Email
                            </label>
                            <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                        </div>
                        <button onClick={sendResetLinkFunc}>
                            Send Reset Link
                        </button>
                        <span className="login__register" onClick={()=>navigate('/')}>
                            Login
                        </span>
                    </div>

                </div>
            </>
            <Footer/>
        </div>
    )
}