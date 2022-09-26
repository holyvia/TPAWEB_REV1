import { useState } from "react"
import { Link } from "react-router-dom";
import HoverProfile from "./HoverProfile";
import './RichText.css'

const MentionHover = ({ text }: { text: string }) => {
    const [hovered, setHovered] = useState("hide_hover")

    let firstIndexMentionTag = text.indexOf('[');
    let lastIndexMentionTag = text.indexOf(']');
    let mentionTagSubString = text.substring(firstIndexMentionTag + 1, lastIndexMentionTag)

    let firstIndexUserId = text.indexOf('(')
    let lastIndexUserId = text.indexOf(')')
    let userIdSubString = text.substring(firstIndexUserId + 1, lastIndexUserId)

    return (
        <>
            <span style={{ position: "relative" }}>
                <Link className="richText-a" onMouseEnter={() => setHovered("show_hover")} onMouseLeave={() => setHovered("hide_hover")} to={`/profile/${userIdSubString}`}>{mentionTagSubString} &nbsp;</Link>
            </span>
            <div className={hovered}>
                <HoverProfile currUser={userIdSubString} />
            </div>
        </>
    )
}

export default MentionHover