import { useEffect, useState } from "react"
import Header from "../Header/Header"
import "../Searching/Searching.css"
import SearchIcon from "@mui/icons-material/Search";
import HeaderOption from "../Header/HeaderOption";
import HomeIcon from "@mui/icons-material/Home";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ProfileDropdown from "../Header/ProfileDropdown";
import { useNavigate, useParams } from "react-router-dom";
import { UseCurrentTheme } from "../../lib/themeContext";
import { UseCurrentUser } from "../../lib/userContext";
import { SEARCH, SEARCH_POST } from "../../query/queries";
import { useQuery } from "@apollo/client";
import logo from '../../assets/smallLogo.png';
import Post from "../Post/Post";
import PostInSearch from "../Post/PostInSearch";
import { EachSearchRes } from "../Searching/EachSearchRes";

export function SearchingPost() {

    const { subString } = useParams()
    const [dropdownClassName, setDropdownClassName] = useState("invisibleDropdown")
    const navigate = useNavigate()
    const [newSubString, setNewSubString] = useState('')
    const [findSubString, setFindSubString] = useState('')
    const { changeTheme, getTheme } = UseCurrentTheme()
    const theme = getTheme()
    const { user } = UseCurrentUser()
    const { data, loading, error, fetchMore, refetch } = useQuery(SEARCH, {
        variables: {
            keyword: subString,
            limit:6,
            offset: 0
        }
    })

    function toggleDropdown() {
        if (dropdownClassName == "invisibleDropdown") {
            setDropdownClassName("dropdown")
        }
        else {
            setDropdownClassName("invisibleDropdown")
        }
    }

    useEffect(() => {
        if (subString != undefined) {
            console.log(subString);

            setNewSubString(subString)
        }

    }, [])

    function fetchMoreFunction() {
        // console.log(data.search);

        fetchMore({
            variables: {
                offset: data.searchpost.length
            }
        }).then(() => {
            console.log(data);

        })
    }

    useEffect(() => {
        console.log(data);
        const onScroll: EventListener = (event: Event) => {
            console.log("--------------", document.body.offsetHeight);
            console.log(window.innerHeight + window.scrollY-100);
            
            if (window.innerHeight + window.scrollY -50 >= document.querySelector(".searching__body").offsetHeight) {
                console.log("true");
                
                fetchMoreFunction()
            }
        }
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll)
        }
    })
    // useEffect(()=>{
    //     if(data){
    //         console.log(data.search.users);
    //     }
    // },[data, loading])

    function goToSearch() {
        navigate(`/search/${newSubString}`)
        // console.log();

    }
    if (subString != undefined && data) {
        console.log(data);

        return (
            <div className="searching" style={{ ...getTheme() }}>
                <div className="header__outer">
                    <div className="header">
                        <div className="header__left">
                            <img
                                src={logo}
                                alt=""
                            />

                            <div className="header__search">
                                <div className="searchButton" onClick={goToSearch}>
                                    <SearchIcon />
                                </div>
                                <input placeholder="Search" type="text" value={newSubString} onChange={(e) => setNewSubString(e.target.value)} />
                            </div>
                        </div>

                        <div className="header__right">
                            <HeaderOption Icon={HomeIcon} title="Home" avatar={undefined} onClick={() => { navigate('/homepage') }} />
                            <HeaderOption Icon={SupervisorAccountIcon} title="My Network" avatar={undefined} onClick={() => { navigate('/network') }} />
                            <HeaderOption Icon={BusinessCenterIcon} title="Jobs" avatar={undefined} onClick={undefined} />
                            <HeaderOption Icon={ChatIcon} title="Message" avatar={undefined} onClick={undefined} />
                            <HeaderOption Icon={NotificationsIcon} title="Notifications" avatar={undefined} onClick={undefined} />
                            <HeaderOption avatar={true} title="me" onClick={toggleDropdown} Icon={undefined} />
                        </div>

                    </div>
                    <div className={dropdownClassName}>
                        <ProfileDropdown />
                    </div>
                </div>
                <div className="searching__body">
                    <h4>Post Search</h4>
                    {
                        data.search.posts.map((post: any) => {
                            return (
                                <Post
                                    id={post.id}
                                    userId={post.userId}
                                    message={post.caption}
                                    photoUrl={post.photo_url}
                                    videoUrl={post.video_url}
                                    likes={post.likes}
                                    comments={post.comments}
                                    refetch={refetch}
                                />
                            )
                        }
                        )
                    }
                </div>
            </div>
        )
    } else {
        return (
            <div className="searching" style={{ ...getTheme() }}>
                <div className="header__outer">
                    <div className="header">
                        <div className="header__left">
                            <img
                                src={logo}
                                alt=""
                            />

                            <div className="header__search">
                                <div className="searchButton" onClick={goToSearch}>
                                    <SearchIcon />
                                </div>
                                <input placeholder="Search" type="text" value={newSubString} onChange={(e) => setNewSubString(e.target.value)} />
                            </div>
                        </div>

                        <div className="header__right">
                            <HeaderOption Icon={HomeIcon} title="Home" avatar={undefined} onClick={() => { navigate('/homepage') }} />
                            <HeaderOption Icon={SupervisorAccountIcon} title="My Network" avatar={undefined} onClick={() => { navigate('/network') }} />
                            <HeaderOption Icon={BusinessCenterIcon} title="Jobs" avatar={undefined} onClick={undefined} />
                            <HeaderOption Icon={ChatIcon} title="Message" avatar={undefined} onClick={undefined} />
                            <HeaderOption Icon={NotificationsIcon} title="Notifications" avatar={undefined} onClick={undefined} />
                            <HeaderOption avatar={true} title="me" onClick={toggleDropdown} Icon={undefined} />
                        </div>

                    </div>
                    <div className={dropdownClassName}>
                        <ProfileDropdown />
                    </div>
                </div>

            </div>
        )
    }
}