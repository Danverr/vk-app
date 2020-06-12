import React, {useState, useEffect} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Panel, PanelHeader, PanelHeaderBack, Spinner, Cell, Header, Avatar, Group, Separator} from "@vkontakte/vkui";
import styles from "./userProfilePanel.module.css";
import api from "../../../utils/api";

import StatsChart from "./statsChart/statsChart";
import StatsCounter from "./statsCounter/statsCounter";
import StatsBars from "./statsBars/statsBars";
import ParamSelector from "./paramSelector/paramSelector";

// Меняем несколько записей за день на одну с их средним значением
// Среди всех принятых stats
const getMeanByDays = (stats) => {
    let meanStats = [];
    let date = null;
    let sum = 0;
    let count = 0;

    for (let stat of stats) {
        if (!date || date.getTime() != stat.date.getTime()) {
            if (date) {
                // Cчитаем среднее и округляем до сотых
                meanStats.push({
                    val: +(sum / count).toFixed(2),
                    date: date
                });

                sum = 0;
                count = 0;
            }

            date = stat.date;
        }

        sum += stat.val;
        count++;
    }

    if (date) {
        meanStats.push({
            val: +(sum / count).toFixed(2),
            date: date
        });
    }

    return meanStats;
};

const formatStats = (data, timezone) => {
    // Инициализируем переменную
    let allStats = {
        mood: [],
        stress: [],
        anxiety: []
    };

    // Группируем статы по параметрам
    for (const stat of data) {
        // Переводим строки в Date с нулевым временем
        stat.date = new Date(stat.date);
        stat.date.setHours(stat.date.getHours() + timezone);
        stat.date.setHours(0, 0, 0, 0);

        for (const param in allStats) {
            allStats[param].push({
                id: stat.entryId,
                val: stat[param],
                date: stat.date
            });
        }
    }

    let meanByDaysStats = {};

    for (const param in allStats) {
        // В конце должны быть новые записи
        allStats[param].reverse();

        meanByDaysStats[param] = getMeanByDays(allStats[param]);
    }

    return {
        all: allStats,
        meanByDays: meanByDaysStats
    };
};

const UserProfilePanel = (props) => {
    const [activeParam, setActiveParam] = useState("mood");
    let [stats, setStats] = useState(null);

    // Загрузка статистики пользователя
    useEffect(() => {
        if (props.userInfo == null) return;

        api("GET", "/entries/stats/", {
            userId: props.userInfo.id,
        }).then((res) => {
            setStats(formatStats(res.data, props.timezone));
        });
    }, [props.userInfo]);

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false}
                         left={<PanelHeaderBack onClick={() => window.history.back()}/>}>
                Профиль
            </PanelHeader>
            {
                !stats ? <Spinner className={styles.loadingSpinner} size="large"/> :
                    <>
                        <Group>
                            <Cell className={styles.avatarCell} before={<Avatar src={props.userInfo.photo_100}/>}>
                                {`${props.userInfo.first_name} ${props.userInfo.last_name}`}
                            </Cell>
                            <ParamSelector activeParam={activeParam} setActiveParam={setActiveParam}/>
                        </Group>

                        <Group header={<Header mode="secondary">Cтатистика по дням</Header>}>
                            <StatsChart
                                stats={stats.meanByDays}
                                activeParam={activeParam}
                                now={props.now}
                            />
                        </Group>

                        <Group header={<Header mode="secondary">Cравнение недель</Header>}>
                            <StatsBars
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

