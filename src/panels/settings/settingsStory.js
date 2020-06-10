import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelHeader, View, Cell, Switch, CellButton, PanelHeaderBack, File, FormLayout, Input } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Icon24UserAdd from '@vkontakte/icons/dist/24/user_add';
import Icon24Download from '@vkontakte/icons/dist/24/download';
import Icon24Education from '@vkontakte/icons/dist/24/education';
import Icon24Document from '@vkontakte/icons/dist/24/document';
import FriendsPanelContent from './friendsPanelContent';
import api from '../../utils/api';

const SettingsStory = (props) => {
    const fileInputRef = useRef(null);

    const importEntries = async (files) => {
        let reader = new FileReader();
        reader.readAsText(files[0]);

        reader.onload = () => {
            if (!props.state.userInfo)
                return;
            const csvparse = require('js-csvparser');
            const entries = csvparse(reader.result).data;
            const moods = ["ужасно", "плохо", "так себе", "хорошо", "супер"];

            entries.map(async (entry) => {
                let mood = moods.indexOf(entry[4]) + 1;
                if (mood >= 1 && mood <= 5) {
                    await api("POST", "/entries/", {
                        userId: props.state.userInfo.id,
                        mood: mood,
                        stress: mood,
                        anxiety: mood,
                        isPublic: 1,
                        title: "",
                        note: entry[6],
                        date: `${entry[0]} ${entry[3]}:00`
                    });
                }
            });
        };
    }

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
                <FormLayout>
                    <File top="Импортировать записи из Daylio" before={<Icon24Document />} controlSize="l" getRef={fileInputRef} accept={".csv"} onChange={() => { importEntries(fileInputRef.current.files); }} />
                </FormLayout>
                <CellButton before={<Icon24Education />}> Пройти обучение </CellButton>
            </Panel>
            <Panel id="friends">
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }} />} >
                    Друзья
                </PanelHeader>
                <FriendsPanelContent nav={props.nav} state={props.state} />
            </Panel>
        </View>
    );
};

export default SettingsStory;

