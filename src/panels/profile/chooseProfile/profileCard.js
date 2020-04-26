import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Card, usePlatform, getClassName} from "@vkontakte/vkui";
import styles from "./profileCard.css";

const ProfileCard = (props) => {
    const platform = usePlatform();
    const baseClassNames = getClassName("headerWrap", platform);

    return (
        <Card size="m" mode="shadow" onClick={props.route} data-to-panel="userProfile">
            <div className={baseClassNames}>{props.name}</div>
            <img className="petPreview" src={props.petSrc}/>
        </Card>
    )
}

export default ProfileCard;

