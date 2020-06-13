import React, { useState, useRef } from 'react';
import { PanelHeader, PanelHeaderBack, File, FormLayout, Text } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import s from './spinner.module.css'

import Icon24Upload from '@vkontakte/icons/dist/24/upload';

import api from '../../utils/api'

const DaylioPanelContent = (props) => {
    const [progress, setProgress] = useState(null);
    const fileInputRef = useRef(null);

    const changeProgress = (a, b) => {
        const PI = Math.PI;
        const R = 40;
        setProgress(
            <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div className={s.beforeContent}>
                <Text className={s.timeLeft} weight='medium'> {`${Math.ceil(a / b * 100)}%`} </Text>
                <svg className={s.circle}>
                    <circle
                        cx="45" cy="45" r={R} stroke="rgb(63,138,224)" strokeWidth="6" fill="transparent"
                        style={{
                            'strokeDasharray': (2 * PI * R * (a / b)).toString() + " 1000",
                        }}
                    />
                </svg>        
            </div>
            <Text className={s.dialog} weight='medium'> {(a == b) && "Загрузка завершена"} </Text>
            </div>
        );
    }

    const importEntries = async (files) => {
        if (!files || files.length == 0)
            return;

        let reader = new FileReader();
        reader.readAsText(files[0]);

        reader.onload = async () => {
            if (!props.state.userInfo)
                return;
            
            const csvparse = require('js-csvparser');
            const entries = csvparse(reader.result).data;
            const moods = ["ужасно", "плохо", "так себе", "хорошо", "супер"];
            var processed = 0;
            changeProgress(processed, entries.length);
            for (var entry of entries) {
                let mood = moods.indexOf(entry[4]) + 1;
                if (mood >= 1 && mood <= 5 && entry.length == 7) {
                    await api("POST", "/entries/", {
                        userId: props.state.userInfo.id,
                        mood: mood,
                        stress: 6 - mood,
                        anxiety: 6 - mood,
                        isPublic: 1,
                        title: "",
                        note: entry[6],
                        date: `${entry[0]} ${entry[3]}:00`
                    });
                }
                processed++;
                changeProgress(processed, entries.length);
            };
        };
    }

    return (
        <div style={{ height: 'calc(100vh - var(--tabbar_height) - var(--panelheader_height_android))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
            <div/>
            {progress}
            <FormLayout>
                <File top="Для импорта данных из Daylio загрузите CSV таблицу с данными. Ее можно найти тут: Больше → Экспорт записей → CSV" before={<Icon24Upload />} controlSize="xl" getRef={fileInputRef} accept={".csv"} onChange={() => { importEntries(fileInputRef.current.files); }}>
                    Загрузить данные
                </File>
            </FormLayout>
        </div>
    );
}
export default DaylioPanelContent;