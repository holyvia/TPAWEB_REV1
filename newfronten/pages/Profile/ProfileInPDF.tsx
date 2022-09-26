import { useEffect, useRef } from "react";
import { useLazyQuery } from "@apollo/client"
import { GET_EDU, GET_EXP, USER } from "../../query/queries";
import EduCard from "./EduCard";
import ExpCard from "./ExpCard";
import { useParams } from "react-router-dom"
import { UseCurrentUser } from "../../lib/userContext";
//{ props }: { props: any }
export default function ProfileInPDF({ props }: { props: any }) {
    const { getUser } = UseCurrentUser()
    const [getExpFunc, { data: experiencesData, loading: experiencesLoading, refetch: refetchExperience }] = useLazyQuery(GET_EXP)
    const [getEduFunc, { data: educationData, loading: educationLoading, refetch: refetchEducation }] = useLazyQuery(GET_EDU)
    const { id } = useParams()
    const containerStyle: any = {
        padding: '30px'
    }

    const hrStyle: any = {
        paddingTop: '10px',
        paddingBottom: '10px',
    }
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


        return (
            <div style={containerStyle}>
                <h2>{props.name}</h2>
                {/* <small>Location</small> */}
                <div style={hrStyle}>
                    <hr />
                </div>
                <h3>Education</h3>
                {
                    educationData != null ?
                        <div className="experience">
                            {
                                educationData.getEducation != null ?
                                    (educationData.getEducation.map((edu: any) => (
                                        <EduCard edu={edu} refetchEdu={refetchEducation} fromPDF={true} />
                                    )))
                                    :
                                    ""
                            }
                        </div>
                        :
                        ""
                }

                <div style={hrStyle}>
                    <hr />
                </div>
                <h3>Experience</h3>
                {
                    experiencesData != null ?
                        <div className="experience">
                            {
                                experiencesData.getExperience != null ?
                                    (experiencesData.getExperience.map((exp: any) => (
                                        <ExpCard refetchExp={refetchExperience} exp={exp} fromPDF={true} />
                                    )))
                                    :
                                    ""
                            }
                        </div>
                        :
                        ""
                }
                <div style={hrStyle}>
                    <hr />
                </div>
                <h3>Contact</h3>
                <p>{props.email}</p>
                <p>LinHEdIn link</p>
            </div>
        )

}
