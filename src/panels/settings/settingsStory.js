import React, { useState } from 'react';
import { Panel, PanelHeader, View, Cell, Switch, CellButton } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Icon24UserAdd from '@vkontakte/icons/dist/24/user_add';
import Icon24Notification from '@vkontakte/icons/dist/24/notification';
import Icon24Download from '@vkontakte/icons/dist/24/download';
import Icon24Education from '@vkontakte/icons/dist/24/education';

const SettingsStory = (props) => {
    let[activePanel, setActivePanel] = useState(props.nav.activePanel);

    return (
        <View id={props.id}
            activePanel={activePanel}
            history={props.nav.viewHistory}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Настройки</PanelHeader>
                <CellButton before = {<Icon24UserAdd/>} onClick = {() => {setActivePanel('friends')}}> Добавить друга </CellButton>
                <Cell asideContent={<Switch/>}>
                    Напоминания о создании записи
                </Cell>
                <Cell asideContent={<Switch/>}>
                    Уведомления о здоровье друзей
                </Cell>
                <CellButton before = {<Icon24Download/>}> Импорт записей из Daylio </CellButton>
                <CellButton before = {<Icon24Education/>}> Пройти обучение </CellButton>
            </Panel>
            <Panel id = "friends">
                <PanelHeader separator={false}>Друзья</PanelHeader>
            </Panel>
        </View>
    );
};

export default SettingsStory;

