import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Panel, PanelHeader, PanelHeaderBack} from "@vkontakte/vkui";

const UserProfile = (props) => {
    return (
        <Panel id={props.id}>
            <PanelHeader separator={false}
                         left={<PanelHeaderBack onClick={props.route} data-to-panel={"chooseProfile"}/>}>
                Профиль
            </PanelHeader>
            Здесь будет отображаться профиль юзера
        </Panel>
    );
}

export default UserProfile;

