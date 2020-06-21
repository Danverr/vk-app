import React from "react";
import styles from "./statsCompareChart.module.css";
import {Button, Subhead} from "@vkontakte/vkui";

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';

const StatsCompareChart = (props) => {
    const {weeksData, activeParam, selectedWeekDate, setSelectedWeekDate} = props;

    const colors = ["var(--very_good)", "var(--good)", "var(--norm)", "var(--bad)", "var(--very_bad)"];
    if (activeParam == "mood") colors.reverse();

    const days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
    const weeksDataKeys = Object.keys(weeksData[activeParam]);
    const baseLen = 20;
    let chartRows = [];

    // Считаем конец прошлой недели
    const prevWeekDate = new Date(selectedWeekDate.getTime());
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);

    const getLineStyle = (date, day) => {
        let lineStyle = {};

        // Определяем выравнивание
        if (date == selectedWeekDate) {
            lineStyle.margin = "auto auto auto 0";
        } else {
            lineStyle.margin = "auto 0 auto auto";
        }

        // Определяем размеры и цвет
        if (date.getTime() in weeksData[activeParam] && day in weeksData[activeParam][date.getTime()]) {
            const val = weeksData[activeParam][date.getTime()][day];
            lineStyle.width = baseLen * val + "%";
            lineStyle.background = colors[Math.round(val) - 1];
        } else {
            lineStyle.width = "0%";
        }

        return lineStyle;
    };

    // Смещаем текущую неделю на offset дней
    const setSelectedWeekDateOffset = (offset) => {
        const newWeekDate = new Date(selectedWeekDate.getTime());
        newWeekDate.setDate(newWeekDate.getDate() + offset);
        setSelectedWeekDate(newWeekDate);
    };

    for (const day of days) {
        chartRows.push(
            <>
                <div className={styles.chartLine} style={getLineStyle(prevWeekDate, day)}/>
                <Subhead weight="medium" className={styles.chartLabel}>{day}</Subhead>
                <div className={styles.chartLine} style={getLineStyle(selectedWeekDate, day)}/>
            </>
        );
    }

    return (
        <div className={styles.chartContainer}>
            <Button
                mode="tertiary" style={{paddingLeft: 0}}
                onClick={() => setSelectedWeekDateOffset(-7)}
                disabled={selectedWeekDate.getTime() == weeksDataKeys[weeksDataKeys.length - 1]}
            >
                <Icon24BrowserBack/>
            </Button>

            <div className={styles.chart}>{chartRows}</div>

            <Button
                mode="tertiary" style={{paddingRight: 0}}
                onClick={() => setSelectedWeekDateOffset(7)}
                disabled={selectedWeekDate.getTime() >= props.curWeekStart}
            >
                <Icon24BrowserForward/>
            </Button>
        </div>
    );
};

export default StatsCompareChart;