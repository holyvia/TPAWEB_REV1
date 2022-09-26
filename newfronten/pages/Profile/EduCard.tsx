import { useState } from "react"
import { DEL_EDU, DEL_EXP, UPDATE_EDU, UPDATE_EXP } from "../../query/queries"
import { useMutation } from "@apollo/client"
import { UseCurrentUser } from "../../lib/userContext"
import toast, { Toaster } from "react-hot-toast"
import "./EduCard.css"
import { useParams } from "react-router-dom"

interface SetPopup {
    edu: any
    refetchEdu: () => any
    fromPDF: any
}

export default function ({edu,refetchEdu,fromPDF}:SetPopup) {
    const {id} = useParams()
    const [company, setCompany] = useState(edu.Company)
    const [grade, setGrade] = useState(edu.Grade)
    const [monthStart, setMonthStart] = useState(edu.MonthStart)
    const [yearStart, setYearStart] = useState(edu.YearStart)
    const [monthEnd, setMonthEnd] = useState(edu.MonthEnd)
    const [yearEnd, setYearEnd] = useState(edu.YearEnd)
    const [popUpCard, setPopUpCard] =useState("hidden")
    const [updateEducation] = useMutation(UPDATE_EDU)
    const [DeleteEducation] = useMutation(DEL_EDU)
    const {getUser} = UseCurrentUser()
    function handleUpdate(){
        if (monthEnd < 1 || monthStart < 1 || monthEnd > 12 || monthStart > 12 || yearEnd < 1 || yearStart < 1 || yearEnd > 2022 || yearStart > 2022) {
            toast.error("date is in wrong format")
        }
        else if (company == "") {
            toast.error("school can't be empty")
        }
        else if (grade == "") {
            toast.error("grade can't be empty")
        }
        console.log(edu);
        
        updateEducation({
            variables:{
                id:edu.ID,
                userId:getUser().id,
                company:company,
                grade:grade,
                image:"",
                description:"",
                monthStart:monthStart,
                monthEnd:monthEnd,
                yearStart:yearStart,
                yearEnd: yearEnd
            }
        })
        refetchEdu()
        setPopUpCard("hidden")
    }

    function handleDelete(){
        DeleteEducation({
            variables:{
                id:edu.ID,
                userId:getUser().id
            }
        })
        refetchEdu()
        setPopUpCard("hidden")
    }

    function prepForEditExp(){
        setPopUpCard("popUpCard")
    }
    return (
        
        <div className="card">
            <Toaster position="top-center"/>
            {edu.Image != "" ?
                <img src={edu.Image} alt="" />
                :
                ""}
            <div className="text">
                <h5>{edu.Company}</h5>
                <p>{edu.Grade}</p>
                <p>{edu.MonthStart}/{edu.YearStart}-{edu.MonthEnd}/{edu.YearEnd}</p>
            </div>
            {id==undefined && fromPDF==false?<button onClick={prepForEditExp}>edit</button>:""}
            
            <div className={popUpCard}>
                <h4>Edit Education</h4>
                <label>
                    School
                </label>
                <input value={company} type="text" name="" id="" onChange={(e) => setCompany(e.target.value)} />
                <label>
                    Grade
                </label>
                <input value={grade} type="text" name="" id="" onChange={(e) => setGrade(e.target.value)} />
                <div className="dateComponent">
                    <div className="eachDate">
                        <label>
                            Start Month
                        </label>
                        <input value={monthStart} onChange={(e) => setMonthStart(e.target.valueAsNumber)} type="number" name="" id="" min="1" max="2" placeholder="only number" />
                        <label>
                            Start Year
                        </label>
                        <input value={yearStart} onChange={(e) => setYearStart(e.target.valueAsNumber)} type="number" name="" id="" min="1" max="4" placeholder="only number" />
                    </div>
                </div>
                <div className="dateComponent">
                    <div className="eachDate">
                        <label>
                            End Month
                        </label>
                        <input value={monthEnd} onChange={(e) => setMonthEnd(e.target.valueAsNumber)} type="number" name="" id="" min="1" max="2" placeholder="only number" />
                        <label>
                            End Year
                        </label>
                        <input value={yearEnd} onChange={(e) => setYearEnd(e.target.valueAsNumber)} type="number" name="" id="" min="1" max="4" placeholder="only number" />
                    </div>
                    <div className="dateComponent">
                        <button onClick={handleUpdate}>Update</button>
                        <button onClick={() => setPopUpCard("hidden")}>Cancel</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}