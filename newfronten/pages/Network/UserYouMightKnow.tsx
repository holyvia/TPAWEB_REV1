import { useQuery } from "@apollo/client"
import { UseCurrentUser } from "../../lib/userContext"
import { USER_YOU_MIGHT_KNOW } from "../../query/queries"
import {EachSearchRes} from "../Searching/EachSearchRes"
import "./invitations.css"
export function UserYouMightKnow(){
    const {getUser} = UseCurrentUser()
    const {data, loading} = useQuery(USER_YOU_MIGHT_KNOW,{
        variables:{
            id:getUser().id
        }
    })
    if(!loading){
        // console.log(data.);
        
        return(
            <div className="container__invitations">
                <div className='container__header'>
                    <p>User You Might Know</p>
                </div>
                <div className='container__cards'>
                    {data.userYouMightKnow!=null?(data.userYouMightKnow.map((dat:any)=>(
                        <div>
                        <hr />
                        <EachSearchRes props={dat}/>
                        </div>
                    ))):("")}
                </div>
            </div>
        )
    }
}