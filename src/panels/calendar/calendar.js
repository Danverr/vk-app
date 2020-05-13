import React, { useState } from 'react';
import { Panel, PanelHeader, View, Div } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Calendar from './react-calendar';
import './calendar.css';

const CalendarPanel = (props) => {
    const [activePanel, setPanel] = useState("main");

    return (
        <View id={props.id} activePanel={activePanel}>
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Div style = {{paddingTop: "0px"}}> 
                <Calendar/>
                </ Div>
            </Panel>
        </View>
    );
}

export default CalendarPanel;

