import React from 'react';
import { Panel, PanelHeader, View, Cell, Switch } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const SettingsStory = (props) => {
    return (
        <View id={props.id}
            activePanel={props.nav.activePanel}
            history={props.nav.viewHistory}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Настройки</PanelHeader>
                <Cell asideContent={<Switch/>}>
                    Напоминания о создании записи
                </Cell>
            </Panel>
        </View>
    );
};

export default SettingsStory;

