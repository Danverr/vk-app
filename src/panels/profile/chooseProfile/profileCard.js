import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Card, usePlatform, getClassName} from "@vkontakte/vkui";
import styles from "./profileCard.module.css";

const ProfileCard = (props) => {
    const platform = usePlatform();
    const rawClasses = getClassName("headerWrap", platform).split(" ");

    let modifyedClasses = "";
    for (let cl of rawClasses) modifyedClasses += styles[cl] + " ";

    return (
        <Card size="m" mode="shadow" onClick={() => props.setPanel("userProfile")}>
            <div className={modifyedClasses}>{props.name}</div>
            <img className={styles.petPreview} src={props.petSrc}/>
        </Card>
    )
};

export default ProfileCard;

