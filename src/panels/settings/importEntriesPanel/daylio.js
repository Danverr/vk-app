import React, { useState, useRef } from 'react';
import { File, FormLayout } from '@vkontakte/vkui';
import s from './importEntriesPanel.module.css'
import '@vkontakte/vkui/dist/vkui.css';

import LoadSpinner from './loadSpinner/loadSpinner'
import Icon24Upload from '@vkontakte/icons/dist/24/upload';

import { platform, IOS } from '@vkontakte/vkui';

import api from '../../../utils/api'

const osname = platform();

const Daylio = (props) => {
    const [progress, setProgress] = useState(<LoadSpinner a={0} b={1} />);
    const fileInputRef = useRef(null);

    const changeProgress = (a, b) => {
        setProgress(<LoadSpinner a={a} b={b} />);
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
                        isPublic: 0,
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
        <div className={((osname === IOS) ? s.iosContainer : s.androidContainer)}>
            <div />
            {progress}
            <FormLayout>
                <File top="Для импорта данных из Daylio загрузите CSV таблицу с данными. Ее можно найти тут: Больше → Экспорт записей → CSV" before={<Icon24Upload />} controlSize="xl" getRef={fileInputRef} accept={".csv"} onChange={() => { importEntries(fileInputRef.current.files); }}>
                    Загрузить данные
                </File>
            </FormLayout>
        </div>
    );
}
export default Daylio;