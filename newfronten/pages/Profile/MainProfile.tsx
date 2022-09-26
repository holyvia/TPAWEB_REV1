import Analytics from "./Analytics";
import DefaultProfile from "./DefaultProfile";
import EducationAndExperience from "./EducationAndExperience";


interface propsAndRefetch{
    refetch:()=>any
    props:any
}

export default function MainProfile({props, refetch}:propsAndRefetch){
    return(
        <div className="mainProfile">
            <DefaultProfile props={props} refetch={refetch}/>
            <Analytics props={props}/>
            <EducationAndExperience/>
        </div>
    )
}