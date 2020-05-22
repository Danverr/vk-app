import React from 'react';
import {Panel, PanelHeader, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const CalendarStory = (props) => {
    return (
        <View id={props.id}
              activePanel={props.nav.activePanel}
              history={props.nav.viewHistory}
              onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
            </Panel>
        </View>
    );
};

export default CalendarStory;
