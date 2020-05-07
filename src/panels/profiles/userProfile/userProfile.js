import React, {useState, useEffect, createRef} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Panel, PanelHeader, PanelHeaderBack, Cell, Button, Avatar, Div} from "@vkontakte/vkui";
import styles from "./userProfile.module.css";

import FlareComponent from "flare-react";
import petPlaceholder from "../../../img/robot.flr";

const UserProfile = (props) => {
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);
    const petContainerRef = createRef();

    let photo = null;
    if (props.userInfo.photo_50) photo = props.userInfo.photo_50;
    else if (props.userInfo.photo_100) photo = props.userInfo.photo_100;
    else if (props.userInfo.photo_200) photo = props.userInfo.photo_200;
    else if (props.userInfo.photo_max_orig) photo = props.userInfo.photo_max_orig;

    useEffect(() => {
        setCanvasHeight(petContainerRef.current.clientHeight);
        setCanvasWidth(petContainerRef.current.clientWidth);
    }, []);

    return (
        <Panel id={props.id}>
            <div className={styles.panelContainer}>
                <PanelHeader separator={false}
                             left={<PanelHeaderBack onClick={() => props.setPanel("chooseProfile")}/>}>
                    Профиль
                </PanelHeader>
                <Cell before={<Avatar src={photo}/>}>
                    {`${props.userInfo.first_name} ${props.userInfo.last_name}`}
                </Cell>
                <Div className={styles.contentContainer}>
                    <div className={styles.petContainer} ref={petContainerRef}>
                        <FlareComponent
                            width={canvasWidth}
                            height={canvasHeight}
                            animationName="fly"
                            file={petPlaceholder}/>
                    </div>
                    <Button size="xl" mode="secondary" onClick={() => props.setModal("stats")}>
                        Статистика
                    </Button>
                </Div>
            </div>
        </Panel>
    );
};

export default UserProfile;

