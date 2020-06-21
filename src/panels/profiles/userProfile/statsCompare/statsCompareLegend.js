import React from 'react';
import styles from "./statsCompareLegend.module.css";
import {Subhead, Title} from "@vkontakte/vkui";
import emoji from "../../../../assets/emoji/emojiList";

const dateFormatter = (date, now) => {
    const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

    // Границы недели в датах
    const startDate = new Date(date.getTime());
    const endDate = new Date(date.getTime());
    endDate.setDate(endDate.getDate() + 6);

    // Границы недели в строках
    const start = `${startDate.getDate()} ${months[startDate.getMonth()]}`;
    const end = `${endDate.getDate()} ${months[endDate.getMonth()]}`;

    let years = "";
    if (startDate.getFullYear() != endDate.getFullYear()) {
        years = `${startDate.getFullYear()} - ${endDate.getFullYear()}`;
    } else if (startDate.getFullYear() != now().getFullYear()) {
        years = `${startDate.getFullYear()}`;
    }

    return (
        <div className={styles.legendDates}>
            <Subhead weight="regular">{`${start} - ${end}`}</Subhead>
            <Subhead weight="regular">{years}</Subhead>
        </div>
    );
};

const getWeekMean = (data, activeParam) => {
    let mean = "????";
    let meanEmoji = emoji.placeholder;
    const dataKeys = data == undefined ? [] : Object.keys(data);

    if (dataKeys.length) {
        mean = dataKeys.reduce((sum, key) => sum + data[key], 0) / dataKeys.length;
        mean = mean.toFixed(2);
        meanEmoji = emoji[activeParam][Math.round(mean) - 1];
    }

    return (
        <div className={styles.legendMeanContainer}>
            <Title level="3" weight="regular">{mean}</Title>
            <img src={meanEmoji}/>
        </div>
    );
};

const StatsCompareLegend = (props) => {
    const {selectedWeekDate} = props;
    const prevWeekDate = new Date(selectedWeekDate.getTime());
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);

    const data = props.weeksData[props.activeParam];

    return (
        <div className={styles.legendContainer}>

            {getWeekMean(data[prevWeekDate.getTime()], props.activeParam)}
            <div/>
            {getWeekMean(data[selectedWeekDate.getTime()], props.activeParam)}

            {dateFormatter(prevWeekDate, props.now)}
            <div/>
            {dateFormatter(selectedWeekDate, props.now)}

        </div>
    );
};

export default StatsCompareLegend;