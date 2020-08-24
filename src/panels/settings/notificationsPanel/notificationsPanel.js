import React, {useState, useEffect} from "react";
import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Cell,
    Switch,
    Group,
    Spinner,
    Snackbar,
    Avatar,
    Button,
} from "@vkontakte/vkui";
import moment from "moment";
import callPicker from "../../../utils/callPicker";
import "@vkontakte/vkui/dist/vkui.css";
import bridge from "@vkontakte/vk-bridge";
import NotificationsPlaceholder from "./notificationsPlaceholder";
import ErrorPlaceholder from "../../../components/errorPlaceholder/errorPlaceholder";
import Icon16Done from "@vkontakte/icons/dist/16/done";
import api from "../../../utils/api";

const NotificationsPanel = (props) => {
    const [snackbar, setSnackbar] = useState(null);
    const [error, setError] = useState(null);
    const [healthNotif, setHealthNotif] = useState(null);
    const [accessNotif, setAccessNotif] = useState(null);
    const [checkinNotif, setCheckinNotif] = useState(null);
    const [curTime, setCurTime] = useState(null);
    const {notifications} = props.state;

    const changesSaved = () => {
        setSnackbar(
            <Snackbar
                layout="vertical"
                onClose={() => setSnackbar(null)}
                before={
                    <Avatar size={24} style={{backgroundColor: "var(--accent)"}}>
                        <Icon16Done fill="#fff" width={14} height={14}/>
                    </Avatar>
                }
            >
                Изменения сохранены
            </Snackbar>
        );
    };

    const changeCheckin = (s) => {
        setCheckinNotif(s);
        api(
            "PUT",
            "/v1.2.0/users/", {
                createEntryNotif: s ? moment(curTime).utc().format("HH:mm") : "null",
                accessGivenNotif: +accessNotif,
                lowStatsNotif: +healthNotif
            }
        )
            .then((res) => {
                changesSaved();
            })
            .catch((error) => {
                setCheckinNotif(!s);
                setError({error: error, reload: () => changeCheckin(s)});
            });
    };

    const changeAccess = (s) => {
        setAccessNotif(s);
        api("PUT", "/v1.2.0/users/", {
            createEntryNotif: checkinNotif ? moment(curTime).utc().format("HH:mm") : "null",
            accessGivenNotif: +s,
            lowStatsNotif: +healthNotif
        })
            .then((res) => {
                changesSaved();
            })
            .catch((error) => {
                setAccessNotif(!s);
                setError({error: error, reload: () => changeAccess(s)});
            });
    };

    const changeHealth = (s) => {
        setHealthNotif(s);
        api("PUT", "/v1.2.0/users/", {
            createEntryNotif: checkinNotif ? moment(curTime).utc().format("HH:mm") : "null",
            accessGivenNotif: +accessNotif,
            lowStatsNotif: +s
        })
            .then((res) => {
                changesSaved();
            })
            .catch((error) => {
                setHealthNotif(!s);
                setError({error: error, reload: () => changeHealth(s)});
            });
    };

    const changeTime = () => {
        const updateTime = (res) => {
            api("PUT", "/v1.2.0/users/", {
                createEntryNotif: checkinNotif ? moment(res).utc().format("HH:mm") : "null",
                accessGivenNotif: +accessNotif,
                lowStatsNotif: +healthNotif
            })
                .then(() => {
                    setCurTime(res);
                    changesSaved();
                })
                .catch((error) => {
                    setError({error: error, reload: () => updateTime(res)});
                });
        };
        callPicker(
            {
                type: "time",
                startDate: curTime.toDate(),
                maxDate: new Date(2050, 0, 1),
            },
            props.setPopout,
            updateTime
        );
    };

    useEffect(() => {
        const fetchData = () => {
            api("GET", "/v1.2.0/users/", {})
                .then((res) => {
                    let time;
                    if (res.data.createEntryNotif == null) {
                        setCheckinNotif(false);
                        time = moment(`2000-01-01 22:00`).utc();
                    } else {
                        setCheckinNotif(true);
                        time = moment.utc(`2000-01-01 ${res.data.createEntryNotif}`);
                    }
                    setCurTime(moment(time).local());
                    setAccessNotif(res.data.accessGivenNotif);
                    setHealthNotif(res.data.lowStatsNotif);
                })
                .catch((error) => {
                    setError({error: error, reload: fetchData});
                });
        };

        fetchData();
    }, []);

    var content = <Spinner size="large"/>;
    if (!notifications)
        content = (
            <NotificationsPlaceholder
                allowNotifications={() => {
                    bridge.send("VKWebAppAllowNotifications", {});
                }}
            />
        );
    else if (error)
        content = (
            <ErrorPlaceholder
                error={error.error}
                action={
                    <Button
                        onClick={() => {
                            setError(null);
                            error.reload();
                        }}
                    >
                        Попробовать снова
                    </Button>
                }
            />
        );
    else if (healthNotif != null && checkinNotif != null && curTime != null) {
        content = (
            <div>
                <Group>
                    <Cell
                        asideContent={
                            <Switch
                                checked={checkinNotif}
                                onChange={(e) => changeCheckin(e.target.checked)}
                            />
                        }
                    >
                        Напоминание об опросе
                    </Cell>
                    {checkinNotif && (
                        <Cell onClick={changeTime} asideContent={moment(curTime).format("HH:mm")}>
                            Время напоминаний
                        </Cell>
                    )}
                </Group>
                <Group>
                    <Cell
                        asideContent={
                            <Switch
                                checked={accessNotif}
                                onChange={(e) => changeAccess(e.target.checked)}
                            />
                        }
                    >
                        Друг выдал Вам доступ
                    </Cell>
                </Group>
                <Group
                    description="Если у пользователя появится запись с низким уровнем настроения, тревожности или стресса - мы уведомим вас">
                    <Cell
                        asideContent={
                            <Switch
                                checked={healthNotif}
                                onChange={(e) => changeHealth(e.target.checked)}
                            />
                        }
                    >
                        Низкие показатели друга
                    </Cell>
                </Group>
                {snackbar}
            </div>
        );
    }

    return (
        <Panel id={props.id}>
            <PanelHeader
                separator={false}
                left={
                    <PanelHeaderBack
                        onClick={() => {
                            props.nav.goBack();
                        }}
                    />
                }
            >
                Уведомления
            </PanelHeader>
            {content}
        </Panel>
    );
};

export default NotificationsPanel;
