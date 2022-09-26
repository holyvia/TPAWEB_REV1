import { useLazyQuery, useQuery, useMutation } from "@apollo/client"
import { UseCurrentUser } from "../../lib/userContext"
import { GENERATE_ID, GET_EDU, GET_EXP, ADD_EXP, UPDATE_EXP, ADD_EDU, UPDATE_USER, UPDATE_EDU } from "../../query/queries"
import "./EducationAndExperience.css"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import ExpCard from "./ExpCard"
import EduCard from "./EduCard"
export default function EducationAndExperience() {
    const { getUser } = UseCurrentUser()
    const { id } = useParams()
    const [getExpFunc, { data: experiencesData, loading: experiencesLoading, refetch: refetchExperience }] = useLazyQuery(GET_EXP)
    const [getEduFunc, { data: educationData, loading: educationLoading, refetch: refetchEducation }] = useLazyQuery(GET_EDU)
    const [company, setCompany] = useState("")
    const [position, setPosition] = useState("")
    const [monthStart, setMonthStart] = useState(1)
    const [yearStart, setYearStart] = useState(2022)
    const [monthEnd, setMonthEnd] = useState(1)
    const [yearEnd, setYearEnd] = useState(2022)
    const [popUpExperienceClass, setPopUpExperienceClass] = useState("hidden")
    const [popUpEducationClass, setPopUpEducationClass] = useState("hidden")
    const { data: generatedId, loading: loadingGenId } = useQuery(GENERATE_ID)
    const [createExp] = useMutation(ADD_EXP)
    const [createEdu] = useMutation(ADD_EDU)
    const [popUpCard, setPopUpCard] = useState("hidden")
    const [updateExp] =useMutation(UPDATE_EDU)

    useEffect(() => {
        console.log(id);
        console.log(getUser().id);

        if (id == undefined) {
            getEduFunc({
                variables: {
                    userId: getUser().id
                }
            })
            getExpFunc({
                variables: {
                    userId: getUser().id
                }
            })
        }
        else {
            getEduFunc({
                variables: {
                    userId: id
                }
            })
            getExpFunc({
                variables: {
                    userId: id
                }
            })
        }
    }, [])
    console.log(experiencesData);

    function handleAddExperience() {
        if (monthEnd < 1 || monthStart < 1 || monthEnd > 12 || monthStart > 12 || yearEnd < 1 || yearStart < 1 || yearEnd > 2022 || yearStart > 2022) {
            toast.error("date is in wrong format")
        }
        else if (company == "") {
            toast.error("company can't be empty")
        }
        else if (position == "") {
            toast.error("position can't be empty")
        }
        // console.log(generatedId);
        // console.log(company);
        // console.log(position);

        else{
            createExp({
                variables: {
                    id: generatedId.generateID,
                    userId: getUser().id,
                    company: company,
                    position: position,
                    description: "",
                    image: "",
                    monthStart: monthStart,
                    yearStart: yearStart,
                    monthEnd: monthEnd,
                    yearEnd: yearEnd
                }
            }).then((e) => {
                console.log(e);
    
            }).catch((e) => {
                console.log(e);
    
            })
        }
        
        refetchExperience()
        setMonthEnd(1);
        setMonthStart(1);
        setYearEnd(2022);
        setYearStart(2022);
        setCompany("");
        setPosition("");
        setPopUpExperienceClass("hidden")
    }

    function handleAddEducation() {
        if (monthEnd < 1 || monthStart < 1 || monthEnd > 12 || monthStart > 12 || yearEnd < 1 || yearStart < 1 || yearEnd > 2022 || yearStart > 2022) {
            toast.error("date is in wrong format")
        }
        else if (company == "") {
            toast.error("school can't be empty")
        }
        else if (position == "") {
            toast.error("grade can't be empty")
        }
        // console.log(generatedId);
        // console.log(company);
        // console.log(position);

        else{
            console.log(generatedId.generateID);
            console.log(company);
            console.log(position);
            
            
            createEdu({
                variables: {
                    id: generatedId.generateID,
                    userId: getUser().id,
                    company: company,
                    grade: position,
                    description: "",
                    image: "",
                    monthStart: monthStart,
                    yearStart:  yearStart,
                    monthEnd: monthEnd,
                    yearEnd: yearEnd
                }
            }).then((e) => {
                console.log(e);
    
            }).catch((e) => {
                console.log(e);
    
            })
        }
        
        refetchEducation()
        setMonthEnd(1);
        setMonthStart(1);
        setYearEnd(2022);
        setYearStart(2022);
        setCompany("");
        setPosition("");
        setPopUpEducationClass("hidden")
    }

    function prepForEditExp(position:any, company:any, startMonth:any, startYear:any, endMonth:any, endYear:any){
        setPosition(position)
        setCompany(company)
        setMonthStart(startMonth)
        setYearStart(startYear)
        setMonthEnd(endMonth)
        setYearEnd(endYear)
        setPopUpCard("popUpcard")
    }

    if (experiencesData && !experiencesLoading && educationData && !educationLoading) {
        console.log(experiencesData.getExperience);

        return (
            <div className="EducationAndExperience">
                <Toaster position="top-center" />
                <h3>Education and Experience</h3>
                <h4>Education</h4>
                {
                   educationData != null ?
                        <div className="experience">
                            {
                               educationData.getEducation != null ?
                                    (educationData.getEducation.map((edu: any) => (
                                        <EduCard edu={edu} refetchEdu={refetchEducation} fromPDF={false}/>
                                    )))
                                    :
                                    ""
                            }
                        </div>
                        :
                        ""
                }
                {id==undefined?
                <button onClick={()=>setPopUpEducationClass("popUpExperience")}>Add Education</button>:
                ""}
                
                <div className={popUpEducationClass}>
                    <h4>Add Experience</h4>
                    <label>
                        School
                    </label>
                    <input value={company} type="text" name="" id="" onChange={(e) => setCompany(e.target.value)} />
                    <label>
                        Grade
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
                            <button onClick={handleAddEducation}>Add</button>
                            <button onClick={() => setPopUpEducationClass("hidden")}>Cancel</button>
                        </div>
                    </div>
                </div>
                <div className="education">
                </div>
                <h4>Experience</h4>

                {
                    experiencesData != null ?
                        <div className="experience">
                            {
                                experiencesData.getExperience != null ?
                                    (experiencesData.getExperience.map((exp: any) => (
                                        <ExpCard refetchExp={refetchExperience} exp={exp} fromPDF={false}/>
                                    )))
                                    :
                                    ""
                            }
                        </div>
                        :
                        ""
                }
                {
                    id==undefined?
                    <button onClick={() => setPopUpExperienceClass("popUpExperience")}>Add Experience</button>
                    :""
                }
                
                <div className={popUpExperienceClass}>
                    <h4>Add Experience</h4>
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
                            <button onClick={handleAddExperience}>Add</button>
                            <button onClick={() => setPopUpExperienceClass("hidden")}>Cancel</button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}