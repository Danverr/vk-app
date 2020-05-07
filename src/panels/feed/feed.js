import React from 'react';
import {Panel, PanelHeader, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const Feed = (props) => {
    return (
        <View id={props.id} activePanel="main">
            <Panel id="main">
                <PanelHeader separator={false}>Лента</PanelHeader>
            </Panel>
        </View>
    );
}

export default Feed;

