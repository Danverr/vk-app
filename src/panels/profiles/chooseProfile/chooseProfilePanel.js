import React, {useState, useEffect} from 'react';
import {Panel, PanelHeader, Group, CardGrid, Spinner, Header, Card} from "@vkontakte/vkui";
import styles from "./chooseProfilePanel.module.css";
import '@vkontakte/vkui/dist/vkui.css';

import avatarPreview from "./../../../assets/stickerPreview.png";
import ProfileCard from "./profileCard/profileCard";
import api from "../../../utils/api";

const ChooseProfilePanel = (props) => {
    const defaultStats = {
        mood: [],
        stress: [],
        anxiety: [],
    };

    // Преобразовываем данные в карточки
    let profileCards = [];
    if (props.usersInfo) {
        profileCards = props.usersInfo.map((info, i) =>
            <ProfileCard
                key={info.id}
                info={info}
                stats={props.stats ? props.stats[info.id].meanByDays : defaultStats}
                name={i === 0 ? "Мой профиль" : `${info.first_name} ${info.last_name}`}
                goToUserProfile={props.goToUserProfile}
                setActiveUserProfile={props.setActiveUserProfile}
            />
        );
    }

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false}>Профиль</PanelHeader>
            <Group className={styles.cardGroup} separator="hide">
                <CardGrid>
                    {
                        // Ставим спиннер, пока данные о юзерах не будут загружены
                        props.usersInfo && props.stats ? profileCards : <Spinner size="large"/>
                    }
                </CardGrid>
            </Group>
        </Panel>
    );
};

export default ChooseProfilePanel;

