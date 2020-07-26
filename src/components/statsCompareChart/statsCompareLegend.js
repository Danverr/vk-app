import React from 'react';
import styles from "./statsCompareLegend.module.css";
import {Subhead, Title} from "@vkontakte/vkui";
import emoji from "../../utils/getEmoji";
import moment from 'moment';
import momentLocale from "moment/locale/ru";

moment.locale("ru", momentLocale);

const dateFormatter = (date) => {
    const startDate = moment(date);
    const endDate = moment(date).add(6, "days");

    let years = "";
    if (!startDate.isSame(endDate, "year")) {
        years = `${startDate.year()} - ${endDate.year()}`;
    } else if (!startDate.isSame(moment(), "year")) {
        years = startDate.format("YYYY");
    }

    return (
        <div className={styles.legendDates}>
            <Subhead weight="regular">{`${startDate.format("D MMM")} - ${endDate.format("D MMM")}`}</Subhead>
            <Subhead weight="regular">{years}</Subhead>
        </div>
    );
};

const getWeekMean = (data, activeParam) => {
    let mean = "????";
    let meanEmoji = emoji.placeholder;
    const dataKeys = data === undefined ? [] : Object.keys(data);

    if (dataKeys.length) {
        mean = dataKeys.reduce((sum, key) => sum + data[key], 0) / dataKeys.length;
        mean = mean.toFixed(2);
        meanEmoji = emoji[activeParam][Math.round(mean) - 1];
    }

    return (
        <div className={styles.legendMeanContainer}>
            <Title level="3" weight="medium">{mean}</Title>
            <img src={meanEmoji} alt=""/>
        </div>
    );
};

const StatsCompareLegend = (props) => {
    const {selectedWeekDate} = props;
    const prevWeekDate = moment(selectedWeekDate).subtract(1, "week");
    const data = props.weeksData[props.activeParam];

    return (
        <div className={styles.legendContainer}>

            {getWeekMean(data[prevWeekDate.valueOf()], props.activeParam)}
            <div/>
            {getWeekMean(data[selectedWeekDate.valueOf()], props.activeParam)}

            {dateFormatter(prevWeekDate)}
            <div/>
            {dateFormatter(selectedWeekDate)}

        </div>
    );
};

export default StatsCompareLegend;