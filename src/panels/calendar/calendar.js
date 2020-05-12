import React, { useState } from 'react';
import { Panel, PanelHeader, View } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { ResponsiveCalendar } from '@nivo/calendar'
import Calendar from 'react-calendar';
import './Calendar.css';

const CalendarPanel = (props) => {
    const [activePanel, setPanel] = useState("main");

    return (
        <View id={props.id} activePanel={activePanel}>
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Calendar tileClassName = {"mybutton"}/>
            </Panel>
        </View>
    );
}

export default CalendarPanel;

