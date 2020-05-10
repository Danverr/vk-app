import React from 'react';
<<<<<<< HEAD
import {Panel, PanelHeader, View} from '@vkontakte/vkui';
=======
import {Panel, PanelHeader, View, CellButton} from '@vkontakte/vkui';
>>>>>>> a46ee8122b6731efa76f439b079139a44a8e8189
import '@vkontakte/vkui/dist/vkui.css';

const Calendar = (props) => {
    return (
<<<<<<< HEAD
        <View id={props.id} activePanel="main">
=======
        <View id={props.id}
              activePanel={props.nav.panel}
              history={props.nav.history}
              onSwipeBack={props.nav.goBack}
        >
>>>>>>> a46ee8122b6731efa76f439b079139a44a8e8189
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
            </Panel>
        </View>
    );
<<<<<<< HEAD
}

export default Calendar;

=======
};

export default Calendar;
>>>>>>> a46ee8122b6731efa76f439b079139a44a8e8189
