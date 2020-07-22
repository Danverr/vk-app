import React, { useState } from 'react';
import { Panel, PanelHeader, View, Cell, CellButton, Group, Header, Button } from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import '@vkontakte/vkui/dist/vkui.css';

import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28PrivacyOutline from '@vkontakte/icons/dist/28/privacy_outline';
import Icon28UploadOutline from '@vkontakte/icons/dist/28/upload_outline';

import NotificationsPanel from './notificationsPanel/notificationsPanel'
import FriendsPanel from './friendsPanel/friendsPanel';
import ImportEntriesPanel from './importEntriesPanel/importEntriesPanel';

const SettingsStory = (props) => {
    const [popout, setPopout] = useState(null);
    
    return (
        <View id={props.id}
            popout={popout}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false} >Настройки</PanelHeader>
                <Group header={<Header mode="secondary">Основные настройки</Header>}>
                    <Cell expandable before={<Icon28Notifications />} onClick={() => { props.nav.goTo(props.id, "notifications"); }}> Уведомления </Cell>
                    <Cell expandable before={<Icon28PrivacyOutline />} onClick={() => { props.nav.goTo(props.id, "friends"); }}> Доступ к статистике </Cell>
                    <Cell expandable before={<Icon28UploadOutline />} onClick={() => { props.nav.goTo(props.id, "daylio"); }}> Импорт из Daylio </Cell>
                </Group>
                <Group header={<Header mode="secondary">Прочее</Header>}>
                    <Cell onClick={() => { bridge.send("VKWebAppShare", {}); }}> Поделиться приложением </Cell>
                    <CellButton> Перейти в группу ВК </CellButton>
                </Group>          
            </Panel>
            <NotificationsPanel id="notifications" nav={props.nav} state={props.state} setPopout={setPopout} />
            <FriendsPanel id="friends" nav={props.nav} state={props.state} setPopout={setPopout} />
            <ImportEntriesPanel id="daylio" nav={props.nav} state={props.state} setPopout={setPopout} />
        </View>
    );
};

export default SettingsStory;

