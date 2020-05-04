import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Panel, PanelHeader, Group} from "@vkontakte/vkui";

const ChooseProfile = (props) => {
    return (
        <Panel id={props.id}>
            <PanelHeader separator={false}>Профиль</PanelHeader>
            <Group separator="hide">
                {props.profiles}
            </Group>
        </Panel>
    );
}

export default ChooseProfile;

