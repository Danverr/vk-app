import React, {useState} from 'react';
import {Panel, PanelHeader, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import CalendarField from './calendarField/CalendarField'

const Calendar = (props) => {
    const [activePanel, setPanel] = useState("main");

    return (
        <View id={props.id} activePanel={activePanel}>
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <CalendarField />
            </Panel>
        </View>
    );
}

export default Calendar;

