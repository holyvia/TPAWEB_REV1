import InputOption from "../InputOption/InputOption";
import CreateIcon from "@mui/icons-material/Create";
import ImageIcon from "@mui/icons-material/Image";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import { useEffect, useState } from "react";
import { NewJob } from "./NewJob";
import "../Feed/Feed.css";
import { useQuery } from "@apollo/client";
import { JOBS } from "../../query/queries";
import { EachJob } from "./EachJob";
export function JobContent() {
    
    const {data,loading} = useQuery(JOBS,{
        variables:{
            limit:10,
            offset:0
        }
    })
    const [create__popup__class, setCreate__popup__class] = useState('hidden')
    if(data && !loading){
        // console.log(data);
        
        return (
            <div className="feed">
            <div className={create__popup__class}>
                <NewJob setClass={setCreate__popup__class} />
            </div>
            <div className="feed__inputContainer">

                <div className="feed__input" onClick={() => setCreate__popup__class('create__popup')}>
                    <CreateIcon />
                    <form>
                        <input
                            type="text"
                            disabled
                            placeholder="Create Job"
                        />
                        <button type="submit">
                            Create
                        </button>
                    </form>
                </div>

            </div>

            {/* Posts */}
            <div className="postContainer">
                {data.getJobs!=null?(data.getJobs.map((item:any) => (
                        <EachJob props={item}/>
                    )
                    )
                ):("")}
                
            </div>
        </div>
    )
}
}