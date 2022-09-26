import { useState } from "react"
import { DEL_EXP, UPDATE_EXP } from "../../query/queries"
import { useMutation } from "@apollo/client"
import { UseCurrentUser } from "../../lib/userContext"
import toast, { Toaster } from "react-hot-toast"
import {useParams} from "react-router-dom"
import "./ExpCard.css"

interface SetPopup {
    exp: any
    refetchExp: () => any
    fromPDF: any
}

export default function ({exp,refetchExp,fromPDF}:SetPopup) {
    console.log(fromPDF);
    
    const {id} = useParams()
    const [company, setCompany] = useState(exp.Company)
    const [position, setPosition] = useState(exp.Position)
    const [monthStart, setMonthStart] = useState(exp.MonthStart)
    const [yearStart, setYearStart] = useState(exp.YearStart)
    const [monthEnd, setMonthEnd] = useState(exp.MonthEnd)
    const [yearEnd, setYearEnd] = useState(exp.YearEnd)
    const [popUpCard, setPopUpCard] =useState("hidden")
    const [updateExperience] = useMutation(UPDATE_EXP)
    const [DeleteExperience] = useMutation(DEL_EXP)
    const {getUser} = UseCurrentUser()
    function handleUpdate(){
        if (monthEnd < 1 || monthStart < 1 || monthEnd > 12 || monthStart > 12 || yearEnd < 1 || yearStart < 1 || yearEnd > 2022 || yearStart > 2022) {
            toast.error("date is in wrong format")
        }
        else if (company == "") {
            toast.error("company can't be empty")
        }
        else if (position == "") {
            toast.error("position can't be empty")
        }
        console.log(exp);
        
        updateExperience({
            variables:{
                id:exp.ID,
                userId:getUser().id,
                company:company,
                position:position,
                image:"",
                description:"",
                monthStart:monthStart,
                monthEnd:monthEnd,
                yearStart:yearStart,
                yearEnd: yearEnd
            }
        })
        refetchExp()
        setPopUpCard("hidden")
    }

    function handleDelete(){
        DeleteExperience({
            variables:{
                id:exp.ID,
                userId:getUser().id
            }
        })
        refetchExp()
        setPopUpCard("hidden")
    }

    function prepForEditExp(){
        setPopUpCard("popUpCard")
    }
    return (
        
        <div className="card">
            <Toaster position="top-center"/>
            {exp.Image != "" ?
                <img src={exp.Image} alt="" />
                :
                ""}
            <div className="text">
                <h5>{exp.Company}</h5>
                <p>{exp.Position}</p>
                <p>{exp.MonthStart}/{exp.YearStart}-{exp.MonthEnd}/{exp.YearEnd}</p>
            </div>
            {id==undefined && fromPDF==false?<button onClick={prepForEditExp}>edit</button>:""}
            <div className={popUpCard}>
                <h4>Edit Experience</h4>
                <label>
                    Company
                </label>
                <input value={company} type="text" name="" id="" onChange={(e) => setCompany(e.target.value)} />
                <label>
                    Position
                </label>
                <input value={position} type="text" name="" id="" onChange={(e) => setPosition(e.target.value)} />
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