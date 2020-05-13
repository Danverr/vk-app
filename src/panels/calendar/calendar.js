import React from 'react';
import {Panel, PanelHeader, View, Div} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Calendar from './react-calendar';
import './calendar.css';

const CalendarPanel = (props) => {
    return (
        <View id={props.id}
              activePanel={props.nav.panel}
              history={props.nav.history}
              onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Div style = {{paddingTop: "0px"}}> 
                <Calendar/>
                </ Div>
            </Panel>
        </View>
    );
};

export default CalendarPanel;