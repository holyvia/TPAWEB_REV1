import { ChangeEvent, useEffect, useState } from 'react'
import { UseCurrentUser } from '../../lib/userContext';
import './EditProfilePopUp.css'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { useMutation } from '@apollo/client';
import { app } from '../../firebase';
import { UPDATE_USER } from '../../query/queries';


export default function EditProfilePopUp(){
    const { getUser, setUserToStr } = UseCurrentUser()
    const [user, setUser] = useState(getUser())
    const [region, setRegion] = useState(user.region);
    const [name, setName] = useState(user.name);
    const [work, setWork] = useState(user.work);
    const [education, setEducation] = useState(user.education)
    const [photoprofileURL, setPhotoprofileURL] = useState("")
    const [backgroundphotoURL, setBackgroundphotoURL] = useState("")
    
    const storage = getStorage()
    const App = app

    async function handleSetImage(event: ChangeEvent<HTMLInputElement>, type: string) {
        const file = event.target.files[0];
        console.log(file);
        let photoRef = ref(storage, `lost/${user.id}`)
        if (type === "prof") {
            photoRef = ref(storage, `profilePhoto/${user.id}`)
            await uploadBytes(photoRef, file)
            const url = await getDownloadURL(photoRef)
            setPhotoprofileURL(url)
        }
        if (type === "bg") {
            photoRef = ref(storage, `backgroundPhoto/${user.id}`)
            await uploadBytes(photoRef, file)
            const url = await getDownloadURL(photoRef)
            setBackgroundphotoURL(url)
        }
    }

    async function setProfilePhoto() {
        const photoRef = ref(storage, `profilePhoto/${user.id}`)
        const url = await getDownloadURL(photoRef)
        setPhotoprofileURL(url)
    }

    async function setBackgroundPhoto() {
        const photoRef = ref(storage, `backgroundPhoto/${user.id}`)
        if(photoRef!=undefined && photoRef!=null){
        const url = await getDownloadURL(photoRef)
            setBackgroundphotoURL(url)
        }
    }

    useEffect(() => {
        setPhotoprofileURL('')
        setBackgroundphotoURL('')
    }, [user.id])

    const [updatePhotoprofile, { data, loading, error }] = useMutation(UPDATE_USER)
    function handleUpdate() {
        updatePhotoprofile({
            variables: {
                id: user.id,
                name: name,
                work: work,
                education: education,
                region: region,
                profileURL: photoprofileURL,
                backgroundURL: backgroundphotoURL
            },

        }).then((e) => {
            console.log("success login");
            console.log(e.data.updateUser);
            if (e && e.data.updateUser.token !== undefined) {
                const user = e.data.updateUser
                console.log(user);
                setUserToStr(user);
                setUser(getUser())
                console.log(user);
                
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(()=>{
        if(user.name){
            setName(user.name);
        }
        if(user.region){
            setRegion(user.region);
        }
    },[user])
    console.log(user);
    return(
        <div className="editProfilePopUp">
            <p className='close__btn' >
                x
            </p>
            <label>
                Name
            </label>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
            <label>
                Region
            </label>
            <input type="text" value={region} onChange={(e)=>setRegion(e.target.value)}/>
            <label>
                Profile Photo
            </label>
            <input type="file" onChange={(e) => handleSetImage(e, "prof")} />
            <label>
                Cover Photo
            </label>
            <input type="file" onChange={(e) => handleSetImage(e, "bg")} />
            <div>
                <button onClick={() => handleUpdate()}>SAVE</button>
            </div>
        </div>
    )
}