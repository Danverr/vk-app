import React, {useState, useEffect, createRef} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Panel, PanelHeader, PanelHeaderBack, Cell, Button, Avatar, Div} from "@vkontakte/vkui";
import styles from "./userProfilePanel.module.css";
import FlareComponent from "flare-react";

import petPlaceholder from "../../../img/robot.flr";
import petController from "./petController";

const UserProfilePanel = (props) => {
    const [pet, setPet] = useState(null);
    const petContainerRef = createRef();

    // Ищем фото пользователя
    let photo = null;
    if (props.userInfo.photo_50) photo = props.userInfo.photo_50;
    else if (props.userInfo.photo_100) photo = props.userInfo.photo_100;
    else if (props.userInfo.photo_200) photo = props.userInfo.photo_200;
    else if (props.userInfo.photo_max_orig) photo = props.userInfo.photo_max_orig;

    // Устанавливаем размеры контейнера анимации
    useEffect(() => {
        setPet(<FlareComponent
            file={petPlaceholder}
            controller={new petController()}
            width={petContainerRef.current.clientWidth}
            height={petContainerRef.current.clientHeight}
            transparent={true}
        />);
    }, []);

    return (
        <Panel id={props.id}>
            <div className={styles.panelContainer}>
                <PanelHeader separator={false}
                             left={<PanelHeaderBack onClick={() => window.history.back()}/>}>
                    Профиль
                </PanelHeader>
                <Cell before={<Avatar src={photo}/>}>
                    {`${props.userInfo.first_name} ${props.userInfo.last_name}`}
                </Cell>
                <Div className={styles.contentContainer}>
                    <div className={styles.petContainer} ref={petContainerRef}>
                        {pet}
                    </div>
                    <Button size="xl" mode="secondary" onClick={() => props.setModal("stats")}>
                        Статистика
                    </Button>
                </Div>
            </div>
        </Panel>
    );
};

export default UserProfilePanel;

