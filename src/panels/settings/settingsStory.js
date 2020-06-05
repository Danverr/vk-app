import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelHeader, View, Cell, Switch, CellButton, PanelHeaderBack} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";

import Icon24UserAdd from '@vkontakte/icons/dist/24/user_add';
import Icon24Download from '@vkontakte/icons/dist/24/download';
import Icon24Education from '@vkontakte/icons/dist/24/education';

import api from '../../utils/api'
import FriendsPanel from './friendsPanel';

const SettingsStory = (props) => { 
    return (
        <View id={props.id}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false} >Настройки</PanelHeader>
                <CellButton before={<Icon24UserAdd />} onClick={() => { props.nav.goTo(props.id, "friends"); }}> Добавить из списка друзей </CellButton>
                <Cell asideContent={<Switch />}>
                    Напоминания о создании записи
                </Cell>
                <Cell asideContent={<Switch />}>
                    Уведомления о здоровье друзей
                </Cell>
                <CellButton before={<Icon24Download />}> Импорт записей из Daylio </CellButton>
                <CellButton before={<Icon24Education />}> Пройти обучение </CellButton>
            </Panel>
            <Panel id="friends">
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }} />} >
                    Друзья
                </PanelHeader>
                <FriendsPanel nav = {props.nav} state = {props.state}/>
            </Panel>
        </View>
    );
};

export default SettingsStory;

