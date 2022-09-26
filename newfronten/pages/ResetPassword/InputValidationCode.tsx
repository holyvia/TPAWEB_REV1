import { useQuery, useMutation } from "@apollo/client"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { UseCurrentTheme } from "../../lib/themeContext"
import { CREATE_LINK, GET_RESET_LINK, USER, USER_BY_EMAIL } from "../../query/queries"
import { useParams } from "react-router-dom"
import { Footer } from "../Footer/Footer"


export function InputValidationCode(){
    const {getTheme} = UseCurrentTheme()
    const [validationCode, setValidationCode] = useState('')
    const [SendResetLink] = useMutation(CREATE_LINK)
    const [linkValCode, setLinkValCode] = useState('')
    const navigate = useNavigate()
    const {id} = useParams()
    const {data, loading} = useQuery(GET_RESET_LINK,{
        variables:{
            id:id
        }
    })

    function submitCode(){
        if(validationCode!=data.getResetLink.validationCode){
            toast.error("Wrong code")
        }
        else{
            navigate(`/resetpass/${id}`)
        }
    }
    return(
        <div className="app" style={{...getTheme()}}>
            <>
                <div className="app__body" >
                <Toaster position="top-center"/>
                    
                    <div className="inputNewPassword">
                        <h2>Input Validation Code</h2>
                        <div className="innerInput" style={{"paddingTop":"0.6rem", "paddingBottom":"0.5rem"}}>
                            <label>
                                Validation Code
                            </label>
                            <input type="text" value={validationCode} onChange={(e)=>{setValidationCode(e.target.value)}} />
                        </div>
                        <button onClick={submitCode}>
                            Submit Code
                        </button>
                        
                    </div>

                </div>
            </>
            <Footer/>
        </div>
    )
}