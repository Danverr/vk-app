import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Panel, PanelHeader, PanelHeaderBack, Cell, Button, Avatar, Div} from "@vkontakte/vkui";
import styles from "./userProfile.module.css";

import petPlaceholder from "../../../img/robot.png";
import avatar from "../../../img/robot.png";

const UserProfile = (props) => {
    return (
        <Panel id={props.id}>
            <div className={styles.panelContainer}>
                <PanelHeader separator={false}
                             left={<PanelHeaderBack onClick={() => props.setPanel("chooseProfile")}/>}>
                    Профиль
                </PanelHeader>
                <Div className={styles.contentContainer}>
                    <Cell before={<Avatar src={avatar}/>}>
                        Маряхин Даниил
                    </Cell>
                    <div className={styles.petContainer}>
                        <img className={styles.pet} src={petPlaceholder}/>
                    </div>
                    <Button size="xl" mode="secondary" onClick={() => props.setModal("statsModal")}>
                        Статистика
                    </Button>
                </Div>
            </div>
        </Panel>
    );
};

export default UserProfile;

