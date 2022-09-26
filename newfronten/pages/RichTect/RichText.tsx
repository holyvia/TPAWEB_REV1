import React from 'react'
import { Link } from 'react-router-dom'
import MentionHover from './MentionHover'
import './RichText.css'

const HastagRichText1 = /#[a-z0-9A-Z]+/g
const HastagRichText2 = /@\[#[a-z0-9A-Z]+/g
const MentionRichText = /@[a-z0-9A-Z]+/g
const URLRichText = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._]{2,1000}\.\b([a-zA-Z0-9@:%_\+.#?&//=]*)/g

const RichText = ({ texts, }: { texts: string }) => {
    // var lastIdx = texts.indexOf(")")
    // var userTagged = texts.substring(0, lastIdx + 1)
    // var capt = texts.split(") ").pop()
    // var texts = capt?.split(" ")
    // console.log(captArr);
    

    return (
        <p>
            {
                texts ?
                    texts.split(" ").map((text) => {
                        if (text.match(HastagRichText2)) {
                            let firstIndexHastag = text.indexOf('[');
                            let lastIndexHastag = text.indexOf(']');
                            let hastagSubString = text.substring(firstIndexHastag + 1, lastIndexHastag)
                            let hastagUrl = text.substring(firstIndexHastag + 2, lastIndexHastag)
                            return <Link className='richText-a' to={`/mainPage/search/tags/${hastagUrl}`}>{hastagSubString} &nbsp;</Link>
                        } else if (text.match(HastagRichText1)) {
                            let hastagUrl = text.substring(1, text.length)
                            return <Link className='richText-a' to={`/mainPage/search/tags/${hastagUrl}`}>{text} &nbsp;</Link>
                        } else if (text.match(URLRichText)) {
                            return <a target="_blank" rel="noopener noreferrer" href={text}>{text} &nbsp;</a>
                        } else if (text.match(MentionRichText)) {
                            return <><MentionHover text={text} /></>
                        } else {
                            return <span>{text} &nbsp;</span>
                        }
                    }) : ""
            }
        </p>
    )
}

export default RichText