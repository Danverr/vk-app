import React from 'react';
import { Panel, PanelHeader, View, Cell, CellButton, Separator, List } from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import '@vkontakte/vkui/dist/vkui.css';

import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28PrivacyOutline from '@vkontakte/icons/dist/28/privacy_outline';
import Icon28UploadOutline from '@vkontakte/icons/dist/28/upload_outline';

import NotificationsPanel from './notificationsPanel/notificationsPanel'
import FriendsPanel from './friendsPanel/friendsPanel';
import ImportEntriesPanel from './importEntriesPanel/importEntriesPanel';

const SettingsStory = (props) => {
    return (
        <View id={props.id}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false} >Настройки</PanelHeader>
                <List>
                    <Cell expandable before={<Icon28Notifications />} onClick={() => { props.nav.goTo(props.id, "notifications"); }}> Уведомления </Cell>
                    <Cell expandable before={<Icon28PrivacyOutline />} onClick={() => { props.nav.goTo(props.id, "friends"); }}> Доступ к статистике </Cell>
                    <Cell expandable before={<Icon28UploadOutline />} onClick={() => { props.nav.goTo(props.id, "daylio"); }}> Импорт записей </Cell>
                </List>
                <Separator />
                <List>
                    <Cell onClick={() => { console.log("ok") }}> Сбросить подсказки </Cell>
                    <Cell onClick={() => { bridge.send("VKWebAppShare", {}); }}> Поделиться приложением </Cell>
                </List>
                <CellButton> Перейти в группу </CellButton>
            </Panel>
            <NotificationsPanel id = "notifications" nav={props.nav} state={props.state}/>
            <FriendsPanel id = "friends" nav={props.nav} state={props.state} />
            <ImportEntriesPanel id = "daylio" nav={props.nav} state={props.state} />
        </View>
    );
};

export default SettingsStory;

