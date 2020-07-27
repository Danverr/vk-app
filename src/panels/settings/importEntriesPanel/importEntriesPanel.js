import React, { useState, useEffect, useRef } from 'react';
import { FormLayout, Panel, PanelHeader, PanelHeaderBack, ScreenSpinner, Button, Counter, Spinner, Text } from '@vkontakte/vkui';
import s from './importEntriesPanel.module.css'
import '@vkontakte/vkui/dist/vkui.css';
import { platform, IOS } from '@vkontakte/vkui';
import LoadSpinner from './loadSpinner/loadSpinner'
import api from '../../../utils/api'
import ImportPlaceholder from './importPlaceholder'
import ErrorPlaceholder from '../../../components/errorPlaceholder/errorPlaceholder';
import bridge from "@vkontakte/vk-bridge";
import moment from 'moment';

const osname = platform();

const ImportEntriesPanel = (props) => {
    const fileInputRef = useRef(null);
    const [top, setTop] = useState(null);
    const [importCount, setImportCount] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [banner, setBanner] = useState(<ImportPlaceholder/>);

    const { userInfo, userToken } = props.state;

    const importEntries = async (files) => {
        if (!files || files.length === 0)
            return;

        if(files[0].name.split('.').pop() !== 'csv'){
            setTop("Некорректный формат файла");
            return;
        }

        let reader = new FileReader();
        reader.readAsText(files[0]);

        reader.onload = async () => {
            if (!userInfo)
                return;

            const moods = ["ужасно", "плохо", "так себе", "хорошо", "супер"];
            
            const csvparse = require('js-csvparser');
            let entries = csvparse(reader.result).data;

            for (const entry of entries){
                if(entry.length !== 7 || moods.indexOf(entry[4]) === -1 || !moment(`${entry[0]} ${entry[3]}:00`).isValid){
                    setTop("Некорректный формат файла");
                    return;
                }
            }

            if(entries.length > 500){
                setTop("Нельзя импортировать более 500 записей за раз");
                return;
            }
            
            props.setPopout(<ScreenSpinner />);

            api("POST", "/entries/", {
                entries: JSON.stringify(entries.map((entry) => {
                    let mood = moods.indexOf(entry[4]) + 1;
                    return ({
                        mood: mood,
                        stress: 6 - mood,
                        anxiety: 6 - mood,
                        isPublic: 0,
                        title: "",
                        note: entry[6],
                        date: `${entry[0]} ${entry[3]}:00`
                    });
                }))
            }).then((res) => {
                setBanner(<LoadSpinner/>);
                setTop(null);
                bridge.send("VKWebAppCallAPIMethod", {
                    method: "storage.set",
                    params: {
                        access_token: userToken,
                        v: "5.103",
                        key: "import",
                        value: ((importCount === 1) ? "#" : importCount - 1)
                    }
                }).then((res) => {
                    window['yaCounter65896372'].reachGoal("importCompleted");
                    setImportCount(importCount - 1);
                });
            }).catch((error) => {
                setTop("Произошла ошибка. Попробуйте еще");
            }).finally(() => {
                props.setPopout(null);
            });
        };
    }

    useEffect(() => {
        if(importCount === 0)
            setTop("У вас не осталось попыток импорта");
    }, [importCount])

    useEffect(() => {
        const fetchImportCount = () => {
            bridge.send("VKWebAppCallAPIMethod", {
                method: "storage.get",
                params: {
                    access_token: userToken,
                    v: "5.103",
                    keys: "import"
                }
            }).then((res) => {
                if (res.response[0].value === "")
                    setImportCount(2);
                else if(res.response[0].value === "#")
                    setImportCount(0);
                else
                    setImportCount(res.response[0].value);
            }).catch((error) => {
                setFetchError(error);
            });
        }
        fetchImportCount();
    }, [userToken]);

    var content = <Spinner size="large" />;

    if (fetchError)
        content = <ErrorPlaceholder error={fetchError} />;
    else if(importCount != null){
        content = (<div className={((osname === IOS) ? s.iosContainer : s.androidContainer)}>
            <div />
            {banner}
            <FormLayout>
                <Button
                    top = {<Text className = {s.errorText}> {top} </Text>}
                    disabled = {importCount === 0} 
                    align="center"
                    Component="label"
                    after={<Counter> {importCount} </Counter>}
                    size="xl"
                >
                    <input 
                    className="File__input" 
                    type="file" 
                    disabled = {importCount === 0} 
                    ref={fileInputRef} 
                    onInput ={() => { importEntries(fileInputRef.current.files); fileInputRef.current.value = null;}} />
                Загрузить записи
            </Button>
            </FormLayout>
        </div>);
    }

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }} />} >
                Импорт
            </PanelHeader>
            {content}
        </Panel>
    );
}
export default ImportEntriesPanel;