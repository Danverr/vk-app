import React from "react";
import {Button, Subhead} from "@vkontakte/vkui";
import styles from "./statsBarsLegend.module.css";

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';

const legendFormatter = (entry) => {
    const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

    // Границы недели в датах
    const startDate = new Date(entry.dataKey);
    const endDate = new Date(entry.dataKey);
    endDate.setDate(endDate.getDate() + 6);

    // Границы недели в строках
    const start = `${startDate.getDate()} ${months[startDate.getMonth()]} ${startDate.getFullYear()}`;
    const end = `${endDate.getDate()} ${months[endDate.getMonth()]} ${startDate.getFullYear()}`;

    return (
        <Subhead weight="regular" style={{color: entry.color}}>
            {`${start} - ${end}`}
        </Subhead>
    );
};

const StatsBarsLegend = ({payload, weeksData, curWeekDate, setCurWeekDate}) => {
    // Смещаем текущую неделю на offset дней
    const setCurWeekDateOffset = (offset) => {
        const newWeekDate = new Date(curWeekDate.getTime());
        newWeekDate.setDate(newWeekDate.getDate() + offset);
        setCurWeekDate(newWeekDate);
    };

    const isButtonDisabled = (index) => {
        const keys = Object.keys(weeksData);

        // Т.к. ключи идут в обратном порядке
        index = keys.length - index - 1;

        return keys[index] == undefined || curWeekDate.getTime() == keys[index];
    };

    return (
        <div className={styles.legendContainer}>
            <Button
                mode="tertiary" onClick={() => setCurWeekDateOffset(-7)}
                disabled={isButtonDisabled(0)}
            >
                <Icon24BrowserBack/>
            </Button>

            <div>{payload.map(legendFormatter)}</div>

            <Button
                mode="tertiary" onClick={() => setCurWeekDateOffset(7)}
                disabled={isButtonDisabled(Object.keys(weeksData).length - 1)}
            >
                <Icon24BrowserForward/>
            </Button>
        </div>
    );
};

export default StatsBarsLegend;