import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Cell, Switch, Text, Group, Spinner, Snackbar, Avatar } from '@vkontakte/vkui';
import moment from 'moment';
import callPicker from '../../../utils/callPicker';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";
import NotificationsPlaceholder from './notificationsPlaceholder'
import ErrorPlaceholder from '../../../components/errorPlaceholder/errorPlaceholder';
import Icon16Done from '@vkontakte/icons/dist/16/done'
import api from '../../../utils/api'

const NotificationsPanel = (props) => {
    const [snackbar, setSnackbar] = useState(null);
    const [error, setError] = useState(null);
    const [healthNotif, setHealthNotif] = useState(null);
    const [checkinNotif, setCheckinNotif] = useState(null);
    const [curTime, setCurTime] = useState(null);
    const { notifications } = props.state;

    const changesSaved = () => {
        setSnackbar(<Snackbar layout="vertical"
            onClose={() => {setSnackbar(null);}}
            before={<Avatar size={24} style={{backgroundColor: 'var(--accent)'}}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
        >
            Изменения сохранены
        </Snackbar>);
    }
    
    const changeCheckin = (e) => {
        const s = e.target.checked;
        setCheckinNotif(s);
        api((s ? "POST" : "DELETE"), "/entryNotifications/", 
        (s ? {time: moment(curTime).utc().format("HH:mm")} : {})).then((res) => {
            changesSaved();
        }).catch((error) => {
            setCheckinNotif(!s);
            setError(error);
        });
    }

    const changeHealth = (e) => {
        const s = e.target.checked;
        setHealthNotif(s);
        api((s ? "POST" : "DELETE"), "/statNotifications/", {}).then((res) => {
            changesSaved();
        }).catch((error) => {
            setHealthNotif(!s);
            setError(error);
        });
    }

    const changeTime = () => {
        callPicker({type: "time", startDate: curTime.toDate(), maxDate: new Date(2050, 0, 1)}, props.setPopout, (res) => {
            api("PUT", "/entryNotifications/", { time: moment(res).utc().format("HH:mm")}).then(() => {
                setCurTime(res);
                changesSaved();
            }).catch((error) => {
                setError(error);
            });
        });
    }

    useEffect(() => {
        const fetchSettings = () => {
            api("GET", "/entryNotifications/", {}).then((res) => {
                let time;
                if(res.data == null){
                    setCheckinNotif(false);
                    time = moment(`2000-01-01 22:00`).utc();
                }
                else{ 
                    setCheckinNotif(true);
                    time = moment.utc(`2000-01-01 ${res.data}`);
                }
                setCurTime(moment(time).local());
            }).catch((error) => {
                setError(error);
            });

            api("GET", "/statNotifications/", {}).then((res) => {
                if(res.data == false)
                    setHealthNotif(false);
                else setHealthNotif(true);
            }).catch((error) => {
                setError(error);
            });
        }
        fetchSettings();
    }, []);

    var content = <Spinner size="large" />;
    if (!notifications)
        content = (<NotificationsPlaceholder allowNotifications = {() => {bridge.send("VKWebAppAllowNotifications", {});}}/>);
    else if (error)
        content = <ErrorPlaceholder error={error} />;
    else if (healthNotif != null && checkinNotif != null && curTime != null) {
        content = (<div>
            <Group>
                <Cell asideContent={<Switch checked={checkinNotif} onChange={changeCheckin} />}>
                    <Text weight="regular">Напоминание о чекине</Text>
                </Cell>
                {checkinNotif && <Cell asideContent={<Text weight="regular" onClick={changeTime}> {moment(curTime).format("HH:mm")} </Text>}>
                    <Text weight="regular">Время напоминаний</Text>
                </Cell>}
            </Group>
            <Group description="Если у пользователя появится запись с низким уровнем настроения, тревожности или стресса - мы уведомим вас">
                <Cell asideContent={<Switch checked={healthNotif} onChange={changeHealth} />}>
                    <Text weight="regular">Низкие показатели друга</Text>
                </Cell>
            </Group>
            {snackbar}
        </div>);
    }

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }} />} >
                Уведомления
            </PanelHeader>
            {content}
        </Panel>
    );
}
export default NotificationsPanel;