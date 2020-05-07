import React from 'react';
import {Panel, PanelHeader, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const CheckIn = (props) => {
    return (
        <View id={props.id} activePanel="main">
            <Panel id="main">
                <PanelHeader separator={false}>Чекин</PanelHeader>
            </Panel>
        </View>
    );
}

export default CheckIn;

