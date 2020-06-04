import React, {useState, useEffect} from 'react';
import {Panel, PanelHeader, Group, CardGrid, Spinner} from "@vkontakte/vkui";
import styles from "./chooseProfilePanel.module.css";
import '@vkontakte/vkui/dist/vkui.css';

import ProfileCard from "./profileCard";
import petPreview from "./../../../assets/stickerPreview.png";

const ChooseProfilePanel = (props) => {
    // Преобразовываем данные в карточки
    let profileCards = [];
    if (props.usersInfo) {
        profileCards = props.usersInfo.map((info, i) =>
            (<ProfileCard
                key={info.id}
                cardName={i === 0 ? "Мой профиль" : `${info.first_name} ${info.last_name}`}
                userInfo={info}
                petPreview={petPreview}
                setActiveUserProfile={props.setActiveUserProfile}
                goTo={props.goTo}
            />)
        );
    }

    // Объединяем карты в группы
    let cardGrids = [];
    for (let i = 0; i < profileCards.length; i += 2) {
        cardGrids.push(<CardGrid key={i}>{[
            profileCards[i],
            i + 1 < profileCards.length ? profileCards[i + 1] : null,
        ]}</CardGrid>);
    }

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false}>Профиль</PanelHeader>
            <Group className={styles.cardGroup} separator="hide">
                {
                    // Ставим спиннер, пока данные о юзерах не будут загружены
                    props.usersInfo ? cardGrids : <Spinner size="large"/>
                }
            </Group>
        </Panel>
    );
};

export default ChooseProfilePanel;

