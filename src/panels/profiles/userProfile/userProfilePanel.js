import React, {useState, useEffect} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {
    Panel, PanelHeader, PanelHeaderBack, PanelHeaderContext, PanelHeaderContent,
    Cell, Header, Avatar, Group, List, Spinner, usePlatform, getClassName,
} from "@vkontakte/vkui";
import styles from "./userProfilePanel.module.css";
import emoji from "../../../assets/emoji/emojiList";

import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import StatsChart from "./statsChart/statsChart";
import StatsCounter from "./statsCounter/statsCounter";
import StatsCompare from "./statsCompare/statsCompare";
import api from "../../../utils/api";

const UserProfilePanel = (props) => {
    let [stats, setStats] = useState(null);
    const [contextOpened, setContextOpened] = useState(false);
    const [activeParam, setActiveParam] = useState("mood");
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

    // Загрузка статистики пользователя
    useEffect(() => {
        if (props.userInfo == null) return;

        api("GET", "/entries/stats/", {
            users: props.userInfo.id,
        }).then((res) => {
            setStats(props.formatStats(res.data[props.userInfo.id]));
        });
    }, [props.userInfo]);

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

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
                                before={<div className={iconClasses}><img src={param.icon} className={iconClasses}/>
                                </div>}
                                asideContent={activeParam == param.name ? <Icon24Done fill="var(--accent)"/> : null}
                                onClick={() => {
                                    setActiveParam(param.name);
                                    toggleContext();
                                }}
                            >
                                {param.content}
                            </Cell>
                        )
                    }
                </List>
            </PanelHeaderContext>
            {
                stats == null ? <Spinner size="large" className={styles.loadingSpinner}/> :

                    <>
                        <Group>
                            <Cell className={styles.avatarCell} before={<Avatar src={props.userInfo.photo_100}/>}>
                                {`${props.userInfo.first_name} ${props.userInfo.last_name}`}
                            </Cell>
                        </Group>

                        <Group header={<Header mode="secondary">Cтатистика по дням</Header>}>
                            <StatsChart
                                stats={stats.meanByDays}
                                activeParam={activeParam}
                                now={props.now}
                            />
                        </Group>

                        <Group header={<Header mode="secondary">Cравнение недель</Header>}>
                            <StatsCompare
                                stats={stats.meanByDays}
                                activeParam={activeParam}
                                now={props.now}
                            />
                        </Group>

                        <Group header={<Header mode="secondary">Счетчик</Header>}>
                            <StatsCounter
                                stats={stats.all}
                                activeParam={activeParam}
                                now={props.now}
                            />
                        </Group>
                    </>
            }
        </Panel>
    );
};

export default UserProfilePanel;

