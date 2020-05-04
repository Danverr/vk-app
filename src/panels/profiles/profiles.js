import React, {useState} from 'react';
import {Panel, PanelHeader, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const Profiles = (props) => {
    const [activePanel, setPanel] = useState("main");

    return (
        <View id={props.id} activePanel={activePanel}>
            <Panel id="main">
                <PanelHeader separator={false}>Профили</PanelHeader>
            </Panel>
        </View>
    );
}

export default Profiles;

