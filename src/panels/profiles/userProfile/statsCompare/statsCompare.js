import React, {useState, useMemo} from 'react';
import {Div, Placeholder} from "@vkontakte/vkui";
import styles from "./statsCompare.module.css";
import moment from "moment";

import StatsCompareLegend from "../../../../components/statsCompareChart/statsCompareLegend";
import StatsCompareChart from "../../../../components/statsCompareChart/statsCompareChart";

moment.locale("ru");

const getDataByWeeks = (stats) => {
    let newStats = {};

    // Перебираем статы
    for (let i = stats.length - 1; i >= 0; i--) {
        const stat = stats[i];
        const weekDate = moment(stat.date).startOf("week");

        // Добавляем в newStats
        if (newStats[weekDate.valueOf()] === undefined) {
            newStats[weekDate.valueOf()] = {};
        }

        newStats[weekDate.valueOf()][stat.date.weekday()] = stat.val;
    }

    // newStats[таймстамп начала недели][сокращение дня недели]
    return newStats;
};

const StatsCompare = (props) => {
    const [selectedWeekDate, setSelectedWeekDate] = useState(moment().startOf("week"));

    // Получаем данные для графиков из стат
    const weeksData = useMemo(() => {
        let weeksData = {};
        for (const param in props.stats)
            weeksData[param] = getDataByWeeks(props.stats[param]);
        return weeksData;
    }, [props.stats]);

    // Если записей нет, вернем Placeholder
    if (props.stats[props.activeParam].length === 0) {
        return (
            <Placeholder header="Недостаточно записей">
                Для сравнения недель нужна хотя бы одна запись.
            </Placeholder>
        );
    }

    return (
        <Div className={styles.container}>

            <StatsCompareLegend
                weeksData={weeksData}
                activeParam={props.activeParam}
                selectedWeekDate={selectedWeekDate}
            />

            <StatsCompareChart
                weeksData={weeksData}
                activeParam={props.activeParam}
                selectedWeekDate={selectedWeekDate}
                setSelectedWeekDate={setSelectedWeekDate}
            />

        </Div>
    )
};

export default StatsCompare;


