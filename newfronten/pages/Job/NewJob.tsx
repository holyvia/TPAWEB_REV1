import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { UseCurrentUser } from "../../lib/userContext"
import { CREATE_JOB, GENERATE_ID } from "../../query/queries"

interface SetPopup{
    setClass:(params:any)=>any
}


export function NewJob({setClass} : SetPopup) {
    const {getUser} = UseCurrentUser()
    const [title, setTitle] = useState('')
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [description, setDescription] = useState('')
    const { data, loading } = useQuery(GENERATE_ID)
    const [createJobFunc] = useMutation(CREATE_JOB)
    
    function handleCreatePost(){
        createJobFunc({
            variables:{
                id: data.generateID,
                userId: getUser().id, 
                title: title, 
                company: company, 
                position: position, 
                description: description
            }
        }).then(()=>{
            window.location.reload()
        })
    }
    if(data && !loading){

        return (
            <div>
                <h4>Create Post</h4>
                <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    placeholder="Title"
                />
                <input
                    type="text"
                    onChange={(e) => setCompany(e.target.value)}
                    value={company}
                    placeholder="Company"
                />
                <input
                    type="text"
                    onChange={(e) => setPosition(e.target.value)}
                    value={position}
                    placeholder="Position"
                />
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder="Description"
                    />

                <button onClick={() => handleCreatePost()}>Create</button>
                <button onClick={() => setClass('hidden')}>cancel</button>
            </div>
        )
    }
}