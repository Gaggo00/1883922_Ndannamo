import React from "react";
import ticket_icon from "../../static/svg/icons/ticket_icon.svg";
import file_icon from "../../static/svg/icons/file_icon.svg";
import image_icon from "../../static/svg/icons/image_icon.svg";
import information_icon from "../../static/svg/icons/information_icon.svg";
import coin_icon from "../../static/svg/icons/coin_icon.svg";
import message_icon from "../../static/svg/icons/message_icon.svg";
import './InternalMenu.css'


const InternalMenu = () => {

    return (
        <div className="internal-menu">
            <img src={information_icon}/>
            <img src={file_icon}/>
            <img src={coin_icon}/>
            <img src={image_icon}/>
            <img src={ticket_icon}/>
            <img src={message_icon}/>
        </div>
    )
}

export default InternalMenu