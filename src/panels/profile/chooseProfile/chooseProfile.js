import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {CardGrid, Panel, PanelHeader, Group} from "@vkontakte/vkui";

import petPlaceholder from "../../../img/robot.png";
import ProfileCard from "./profileCard";

const profileCards = [
    {name: "Маряхин Даниил", petSrc: petPlaceholder},
    {name: "Маряхин Даниил", petSrc: petPlaceholder},
    {name: "Маряхин Даниил", petSrc: petPlaceholder},
    {name: "Маряхин Даниил", petSrc: petPlaceholder},
];

function profilesToJsx(list, setPanel) {
    let cardGroup = [];

    for (let i = 0; i < profileCards.length; i += 2) {
        let row = [
            <ProfileCard name={profileCards[i].name} petSrc={profileCards[i].petSrc} setPanel={setPanel}/>
        ];

        if (i + 1 < profileCards.length)
            row.push(
                <ProfileCard name={profileCards[i + 1].name} petSrc={profileCards[i + 1].petSrc} setPanel={setPanel}/>
            );

        cardGroup.push(<CardGrid>{row}</CardGrid>);
    }

    return cardGroup;
}

const ChooseProfile = (props) => {
    return (
        <Panel id={props.id}>
            <PanelHeader separator={false}>Профиль</PanelHeader>
            <Group separator="hide">
                {profilesToJsx(profileCards, props.setPanel)}
            </Group>
        </Panel>
    );
}

export default ChooseProfile;

