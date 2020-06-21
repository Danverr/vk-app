import React, {useState, useMemo} from 'react';
import {Div, Placeholder} from "@vkontakte/vkui";
import styles from "./statsCompare.module.css";

import StatsCompareLegend from "./statsCompareLegend";
import StatsCompareChart from "./statsCompareChart";

const getWeekStart = (date) => {
    const newDate = new Date(date.getTime());
    newDate.setHours(0, 0, 0, 0);
    newDate.setDate(newDate.getDate() - (newDate.getDay() == 0 ? 6 : newDate.getDay() - 1));

    return newDate;
};

const getDataByWeeks = (stats) => {
    const days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
    let newStats = {};

    // Перебираем статы
    for (let i = stats.length - 1; i >= 0; i--) {
        const stat = stats[i];
        const weekDate = getWeekStart(stat.date);

        // Добавляем в newStats
        if (newStats[weekDate.getTime()] == undefined) {
            newStats[weekDate.getTime()] = {};
        }

        let day = stat.date.getDay();
        day = days[day == 0 ? 6 : day - 1];
        newStats[weekDate.getTime()][day] = stat.val;
    }

    // newStats[таймстамп начала недели][сокращение дня недели]
    return newStats;
};

const StatsCompare = (props) => {
    const [selectedWeekDate, setSelectedWeekDate] = useState(getWeekStart(props.now()));

    // Получаем данные для графиков из стат
    const weeksData = useMemo(() => {
        let weeksData = {};
        for (const param in props.stats)
            weeksData[param] = getDataByWeeks(props.stats[param]);
        return weeksData;
    }, [props.stats]);

    // Если записей нет, вернем Placeholder
    if (props.stats[props.activeParam].length == 0) {
        return (
            <Placeholder header="Недостаточно записей">
                Для сравнения недель нужна хотя бы одна запись
            </Placeholder>
        );
    }

    return (
        <Div className={styles.container}>

            <StatsCompareLegend
                weeksData={weeksData}
                activeParam={props.activeParam}
                selectedWeekDate={selectedWeekDate}
                now={props.now}
            />

            <StatsCompareChart
                weeksData={weeksData}
                activeParam={props.activeParam}
                selectedWeekDate={selectedWeekDate}
                setSelectedWeekDate={setSelectedWeekDate}
                curWeekStart={getWeekStart(props.now())}
            />

        </Div>
    )
};

export default StatsCompare;


