import { useMutation } from "@apollo/client"
import { log } from "console"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useParams } from "react-router-dom"
import { UseCurrentTheme } from "../../lib/themeContext"
import { UPDATE_PASS } from "../../query/queries"
import Header from "../Header/Header"
import "../Homepage/Homepage.css"
import { useNavigate } from "react-router-dom"

export function ResetPassword(){
    const {id} = useParams()
    const {getTheme} = UseCurrentTheme()
    const [pass, setPass] = useState('')
    const [repPass, setRepPass] = useState('')
    const [updatePass] = useMutation(UPDATE_PASS)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    function updatePassword(){
        if(pass == ""){
            toast.error("Password can't be empty")
        }
        else if(pass!= repPass){
            toast.error("Password incorrect!")
        }
        else{
            updatePass({
                variables:{
                    id: id,
                    newPassword: pass
                }
            }).then(()=>{
                console.log("password updated");
                toast.success("Password is updated")
                navigate("/")
            }
            ).catch((e)=>{
                console.log(e);
            })
        }
    }

    return (
        <div className="app" style={{...getTheme()}}>
            <>
                <div className="app__body">
                    <Toaster position="top-center"/>
                    <div className="inputNewPassword">
                        <div className="innerInput">
                            <label>
                                New password
                            </label>
                            <input type="password" value={pass} onChange={(e)=>{setPass(e.target.value)}} />
                        </div>
                        <div className="innerInput">
                            <label>
                                Repeat password
                            </label>
                            <input type="password" value={repPass} onChange={(e)=>{setRepPass(e.target.value)}}/>
                        </div>
                        <button onClick={updatePassword}>
                            Update password
                        </button>
                    </div>
                </div>
            </>
        </div>
    )
}