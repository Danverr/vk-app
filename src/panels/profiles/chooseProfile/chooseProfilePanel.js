import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Panel, PanelHeader, Group, CardGrid} from "@vkontakte/vkui";

import ProfileCardPanel from "./profileCardPanel";
import petPreview from "./../../../assets/robot.svg";

const ChooseProfilePanel = (props) => {
    // Преобразовываем данные в карточки
    let profileCards = [];
    if (props.usersInfo) {
        profileCards = props.usersInfo.map((info, i) =>
            (<ProfileCardPanel
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
            <Group separator="hide">
                {cardGrids}
            </Group>
        </Panel>
    );
};

export default ChooseProfilePanel;

