import React, {useState} from 'react';
import {Panel, PanelHeader, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const Calendar = (props) => {
    const [activePanel, setPanel] = useState("main");

    return (
        <View id={props.id} activePanel={activePanel}>
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
            </Panel>
        </View>
    );
}

export default Calendar;

