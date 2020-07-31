
import React, { useState, useRef } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Cell, Switch, Text, Group, Header, Button, FixedLayout, FormLayout, Avatar, Snackbar, ScreenSpinner, InfoRow, SimpleCell } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import s from './import.module.css'
import Icon12Lock from '@vkontakte/icons/dist/12/lock';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import moment from 'moment'
import api from '../../../utils/api'
import bridge from '@vkontakte/vk-bridge'

const DaylioPanel = (props) => {
    const fileInputRef = useRef(null);
    const [isPrivate, setIsPrivate] = useState(true);
    const [top, setTop] = useState(null);
    const {userInfo, userToken} = props.state;
    const {importCount, setImportCount, setSnackbar, setPopout} = props;

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
            const entries = csvparse(reader.result).data;

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
            setPopout(<ScreenSpinner/>);
            api("POST", "/v1.0/entries/", {
                entries: JSON.stringify(entries.map((entry) => {
                    let mood = moods.indexOf(entry[4]) + 1;
                    let date = moment(`${entry[0]} ${entry[3]}:00`);
   
                    return ({
                        mood: mood,
                        stress: 6 - mood,
                        anxiety: 6 - mood,
                        isPublic: (+!isPrivate),
                        title: "",
                        note: entry[6],
                        date: date.utc().format("YYYY-MM-DD HH:mm:ss")
                    });
                }))
            }).then((res) => {
                setTop(null);
                bridge.send("VKWebAppCallAPIMethod", {
                    method: "storage.set",
                    params: {
                        access_token: userToken,
                        v: "5.120",
                        key: "import",
                        value: ((importCount === 1) ? "#" : importCount - 1)
                    }
                }).then((res) => {
                    window['yaCounter65896372'].reachGoal("importCompleted");
                    setImportCount(importCount - 1);
                    setSnackbar(<Snackbar 
                        className = {s.snackbar}
                        layout="vertical"
                        onClose={() => setSnackbar(null)}
                        before={<Avatar size={24} style={{ backgroundColor: 'var(--accent)' }}><Icon16Done
                            fill="#fff" width={14} height={14} /></Avatar>}>
                        Изменения сохранены
                    </Snackbar>);
                    props.nav.goBack();
                });
            }).catch((error) => {
                setTop("Произошла ошибка. Попробуйте еще");
            }).finally(() => {
                setPopout(null);
            });
        };
    }

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }} />} >
                Импорт
            </PanelHeader>        
            <Group>
                <SimpleCell disabled> <InfoRow header = "Шаг 1"> Зайдите в раздел Daylio “Больше” </InfoRow> </SimpleCell> 
                <SimpleCell disabled> <InfoRow header = "Шаг 2"> Нажмите на “Экспорт записей” </InfoRow> </SimpleCell> 
                <SimpleCell disabled> <InfoRow header = "Шаг 3">  Выберите формат CSV и сохраните файл </InfoRow> </SimpleCell> 
                <SimpleCell disabled> <InfoRow header = "Шаг 4"> Загрузите файл в mood </InfoRow> </SimpleCell> 
            </Group>
            <Group>
                <Cell asideContent={<Switch checked = {isPrivate} onChange = {(e) => setIsPrivate(e.target.checked)}/>} description="Весь текст будет скрыт">
                    <div style = {{display: 'flex'}}> <Text weight="regular">Cделать приватными</Text> <Icon12Lock fill = 'var(--text_secondary)'style = {{marginLeft: '6px', marginTop: '4px'}}/></div> 
                </Cell>
            </Group>
            <FixedLayout vertical="bottom">
                <FormLayout>
                    <Button
                        top={<Text className={s.errorText}> {top} </Text>}
                        disabled={importCount === 0}
                        align="center"
                        Component="label"
                        size="xl">
                        <input
                            className="File__input"
                            type="file"
                            disabled={importCount === 0}
                            ref={fileInputRef}
                            onInput={() => { importEntries(fileInputRef.current.files); fileInputRef.current.value = null; }} />
                        Загрузить записи
                    </Button>
                </FormLayout>
            </FixedLayout>
        </Panel>
    );
}
export default DaylioPanel;