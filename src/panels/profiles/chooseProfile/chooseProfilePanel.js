import React, {useState, useEffect} from 'react';
import {Panel, PanelHeader, Group, CardGrid, Spinner, Header, Card} from "@vkontakte/vkui";
import styles from "./chooseProfilePanel.module.css";
import '@vkontakte/vkui/dist/vkui.css';

import avatarPreview from "./../../../assets/stickerPreview.png";

const ChooseProfilePanel = (props) => {
    // Преобразовываем данные в карточки
    let profileCards = [];
    if (props.usersInfo) {
        profileCards = props.usersInfo.map((info, i) =>
            <Card key={info.id} size="m" mode="shadow" onClick={() => {
                props.goToUserProfile();
                props.setActiveUserProfile(info);
            }}>
                <Header level="3" weight="medium">
                    {i === 0 ? "Мой профиль" : `${info.first_name} ${info.last_name}`}
                </Header>
                <img className={styles.avatarPreview} src={avatarPreview}/>
            </Card>
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

