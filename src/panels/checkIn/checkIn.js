import React from 'react';
import {Panel, PanelHeader, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const CheckIn = (props) => {
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
                <PanelHeader separator={false}>Чекин</PanelHeader>
            </Panel>
        </View>
    );
}

export default CheckIn;

