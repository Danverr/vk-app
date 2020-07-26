import React, {useState, useEffect} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {
    Panel, PanelHeader, PanelHeaderBack, PanelHeaderContext, PanelHeaderContent,
    Cell, Header, Avatar, Group, List, Spinner, usePlatform, getClassName, Button
} from "@vkontakte/vkui";
import styles from "./userProfilePanel.module.css";
import emoji from "../../../utils/getEmoji";
import api from "../../../utils/api";

import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import ErrorPlaceholder from "../../../components/errorPlaceholder/errorPlaceholder";
import StatsChart from "./statsChart/statsChart";
import StatsCounter from "./statsCounter/statsCounter";
import StatsCompare from "./statsCompare/statsCompare";

let localState = {
    userId: null,
    stats: null,
    activeParam: "mood"
};

const UserProfilePanel = (props) => {
    const {formatStats, userInfo} = props;
    if (userInfo && userInfo.id !== localState.userId) {
        localState = {
            userId: null,
            stats: null,
            activeParam: "mood",
            contextOpened: false
        };
    }

    const [error, setError] = useState(null);
    const [stats, setStats] = useState(localState.stats);
    const [activeParam, setActiveParam] = useState(localState.activeParam);
    const [contextOpened, setContextOpened] = useState(false);

    // Обновляем локальный стейт
    useEffect(() => {
        localState = {
            userId: userInfo.id,
            stats: stats,
            activeParam: activeParam
        };
    }, [stats, activeParam, userInfo, contextOpened]);


    const fetchData = () => {
        api("GET", "/entries/stats/", {
            users: userInfo.id,
        }).then((res) => {
            setStats(formatStats(res.data[userInfo.id]));
        }).catch((error) => {
            setError({error: error, reload: fetchData});
        });
    }

    // Загрузка статистики пользователя
    useEffect(() => {
        if (userInfo === null) return;
        fetchData();
    }, [userInfo, formatStats]);

    const platform = usePlatform();
    const iconClasses = `${getClassName("Icon", platform)} Icon--28 ${styles.contextIcon}`;
    const params = [
        {
            name: "mood",
            content: "Настроение",
            icon: emoji.mood[0],
        },
        {
            name: "stress",
            content: "Стресс",
            icon: emoji.stress[4],
        },
        {
            name: "anxiety",
            content: "Тревожность",
            icon: emoji.anxiety[4],
        },
    ];

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    let content = <Spinner size="large" className={styles.loadingSpinner}/>;

    if (error) {
        content = <ErrorPlaceholder error={error.error} action = {<Button onClick = {() => {setError(null); error.reload();}}> Попробовать снова </Button>} />;
    } else if (stats) {
        content = <>
            <Group>
                <Cell className={styles.avatarCell} before={<Avatar src={userInfo.photo_100}/>}>
                    {`${userInfo.first_name} ${userInfo.last_name}`}
                </Cell>
            </Group>

            <Group header={<Header mode="secondary">Cтатистика по дням</Header>}>
                <StatsChart userId={userInfo.id} stats={stats.meanByDays} activeParam={activeParam}/>
            </Group>

            <Group header={<Header mode="secondary">Cравнение недель</Header>}>
                <StatsCompare stats={stats.meanByDays} activeParam={activeParam}/>
            </Group>

            <Group header={<Header mode="secondary">Счетчик</Header>}>
                <StatsCounter stats={stats.all} activeParam={activeParam}/>
            </Group>
        </>;
    }

    return (
        <Panel id={props.id}>
            <PanelHeader
                separator={false}
                left={<PanelHeaderBack onClick={() => window.history.back()}/>}
            >
                <PanelHeaderContent
                    aside={<Icon16Dropdown style={{transform: `rotate(${contextOpened ? '180deg' : '0'})`}}/>}
                    onClick={toggleContext}
                >
                    Профиль
                </PanelHeaderContent>
            </PanelHeader>

            <PanelHeaderContext opened={contextOpened} onClose={toggleContext}>
                <List>
                    {
                        params.map((param) =>
                            <Cell
                                key={param.name}
                                before={<div className={iconClasses}>
                                    <img src={param.icon} className={iconClasses} alt=""/>
                                </div>}
                                asideContent={activeParam === param.name ? <Icon24Done fill="var(--accent)"/> : null}
                                onClick={() => {
                                    toggleContext();
                                    setActiveParam(param.name);
                                }}
                            >
                                {param.content}
                            </Cell>
                        )
                    }
                </List>
            </PanelHeaderContext>

            {content}

        </Panel>
    );
};

export default UserProfilePanel;

