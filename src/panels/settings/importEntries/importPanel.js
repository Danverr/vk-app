import React, { useState, useEffect } from 'react';
import { Header, Panel, PanelHeader, PanelHeaderBack, Button, Div, Text, Group, Cell, Radio, FixedLayout, Title, Spinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";
import ErrorPlaceholder from '../../../components/errorPlaceholder/errorPlaceholder';

const ImportPanel = (props) => {
    const [value, setValue] = useState('daylio');
    const [error, setError] = useState(null);
    const { userToken } = props.state;
    const {importCount, setImportCount, snackbar} = props;

    useEffect(() => { 
        const fetchImportCount = () => {
            bridge.send("VKWebAppCallAPIMethod", {
                method: "storage.get",
                params: {
                    access_token: userToken,
                    v: "5.120",
                    keys: "import"
                }
            }).then((res) => {
                if (res.response[0].value === "")
                    setImportCount(2);
                else if(res.response[0].value === "#")
                    setImportCount(0);
                else
                    setImportCount(+res.response[0].value);
            }).catch((error) => {
                setError({ error: error, reload: fetchImportCount });
            });
        }    
        fetchImportCount();
    }, [userToken, setImportCount]);

    const onChange = (data) => {
        setValue(data.target.value);
    }

    const addAttempt = () => {
        bridge.send("VKWebAppCallAPIMethod", {
            method: "storage.set",
            params: {
                access_token: userToken,
                v: "5.120",
                key: "import",
                value: importCount + 1
            }
        }).then((res) => {
            setImportCount(importCount + 1);
        }).catch(() => {
            setError({ error: error, reload: addAttempt });
        });
    }

    var content = <Spinner size="large" />;

    if (error)
        content = <ErrorPlaceholder error={error.error} action={<Button onClick={() => {
            setError(null);
            error.reload();
        }}> Попробовать снова </Button>} />;
    else if (importCount !== null){
        const attempts = (process.env.NODE_ENV === "development") ? 
        <Cell indicator = {<Text> {importCount} </Text>} onClick = {addAttempt}> <Title style = {{color: "var(--accent)"}}> Осталось попыток импорта </Title> </Cell> : 
        <Cell indicator = {<Text> {importCount} </Text>}> <Title style = {{color: "var(--accent)"}}> Осталось попыток импорта </Title> </Cell>;
        content = <div> 
            <Group header={<Header mode="secondary">Откуда импортировать</Header>}>
                <Radio name="import" value="daylio" defaultChecked onChange={onChange}> Daylio </Radio>
                <Radio name="import" value="pixels" onChange={onChange}>Pixels</Radio>
            </Group>
            <Group>
                {attempts}
            </Group>
            {snackbar}
            <FixedLayout vertical="bottom">
                <Div>
                    <Button disabled={importCount === 0} size="xl" onClick={() => props.nav.goTo(props.storyId, value)}> Далее </Button>
                </Div>
            </FixedLayout>
        </div>;
    }

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => props.nav.goBack()} />} >
                Импорт
            </PanelHeader>
            {content}
        </Panel>
    );
}
export default ImportPanel;