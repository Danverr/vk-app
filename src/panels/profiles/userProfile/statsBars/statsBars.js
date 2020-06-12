import React, {useState, useMemo} from 'react';
import {Div, Placeholder} from "@vkontakte/vkui";
import {BarChart, Bar, YAxis, XAxis, ResponsiveContainer, Legend} from 'recharts';
import styles from "./statsBars.module.css";

import StatsBarsLegend from "./statsBarsLegend";

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

const StatsBars = (props) => {
    const [curWeekDate, setCurWeekDate] = useState(getWeekStart(props.now()));
    const days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

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
                Чтобы сравнить недели, нужно иметь хотя бы одну запись
            </Placeholder>
        );
    }

    // Считаем конец прошлой недели
    const prevWeekDate = new Date(curWeekDate.getTime());
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);

    let curWeekData = weeksData[props.activeParam][curWeekDate.getTime()];
    if (curWeekData == undefined) curWeekData = {};

    let prevWeekData = weeksData[props.activeParam][prevWeekDate.getTime()];
    if (prevWeekData == undefined) prevWeekData = {};

    // Формируем данные для графика
    let data = [];

    for (const day of days) {
        data.push({
            [curWeekDate.toString()]: day in curWeekData ? curWeekData[day] : 0,
            [prevWeekDate.toString()]: day in prevWeekData ? prevWeekData[day] : 0,
            day: day,
        });
    }

    return (
        <Div className={styles.container}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barCategoryGap="20%">
                    <XAxis dataKey="day"/>
                    <YAxis hide={true} domain={[0, 6]}/>
                    <Bar dataKey={curWeekDate.toString()} fill="var(--very_good)"/>
                    <Bar dataKey={prevWeekDate.toString()} fill="var(--very_bad)"/>
                    <Legend verticalAlign="top" content={
                        <StatsBarsLegend
                            weeksData={weeksData[props.activeParam]}
                            curWeekDate={curWeekDate}
                            setCurWeekDate={setCurWeekDate}
                        />
                    }/>
                </BarChart>
            </ResponsiveContainer>
        </Div>
    )
};

export default StatsBars;


