import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Card, usePlatform, getClassName} from "@vkontakte/vkui";
import styles from "./profileCard.module.css";

const ProfileCard = (props) => {
    const platform = usePlatform();
    const headerWrap = getClassName("headerWrap", platform).split(" ");

    let modifyedHeaderWrap = "";
    for (let cl of headerWrap) modifyedHeaderWrap += styles[cl] + " ";

    return (
        <Card size="m" mode="shadow" onClick={() => {
            props.setPanel("userProfile");
            props.setUserProfile(props.userInfo);
        }}>
            <div className={modifyedHeaderWrap}>{props.cardName}</div>
            <img className={styles.petPreview} src={props.petSrc}/>
        </Card>
    )
};

export default ProfileCard;

