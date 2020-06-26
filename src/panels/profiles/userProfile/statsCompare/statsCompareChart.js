import React from "react";
import styles from "./statsCompareChart.module.css";
import {Button, Subhead} from "@vkontakte/vkui";
import getColors from "../../../../utils/getColors";
import moment from "moment";

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';

const StatsCompareChart = (props) => {
    const {weeksData, activeParam, selectedWeekDate, setSelectedWeekDate} = props;
    const colors = getColors(activeParam);
    const baseLen = 20;
    let chartRows = [];

    const weeksDataKeys = Object.keys(weeksData[activeParam]);
    const lastWeekDate = moment(parseInt(weeksDataKeys[weeksDataKeys.length - 1]));

    // Считаем конец прошлой недели
    const prevWeekDate = selectedWeekDate.clone().subtract(1, "week");

    const getLineStyle = (date, day) => {
        let lineStyle = {};

        // Определяем выравнивание
        if (date.isSame(selectedWeekDate)) {
            lineStyle.margin = "auto auto auto 0";
        } else {
            lineStyle.margin = "auto 0 auto auto";
        }

        // Определяем размеры и цвет
        if (date.valueOf() in weeksData[activeParam] && day in weeksData[activeParam][date.valueOf()]) {
            const val = weeksData[activeParam][date.valueOf()][day];
            lineStyle.width = baseLen * val + "%";
            lineStyle.background = colors[Math.round(val) - 1];
        } else {
            lineStyle.width = "0%";
        }

        return lineStyle;
    };

    for (let day = 0; day < 7; day++) {
        chartRows.push(<div
            key={`${day}LinePrev`} className={styles.chartLine} style={getLineStyle(prevWeekDate, day)}
        />);
        chartRows.push(<Subhead
            key={`${day}Title`} weight="regular"
            className={styles.chartLabel}>{moment().startOf("week").add(day, "days").format("dd")}
        </Subhead>);
        chartRows.push(<div
            key={`${day}LineCur`} className={styles.chartLine} style={getLineStyle(selectedWeekDate, day)}/>
        );
    }

    return (
        <div className={styles.chartContainer}>
            <Button
                mode="tertiary" style={{paddingLeft: 0}}
                onClick={() => setSelectedWeekDate(selectedWeekDate.clone().subtract(1, "week"))}
                disabled={selectedWeekDate.isSame(lastWeekDate, "week")}
            >
                <Icon24BrowserBack/>
            </Button>

            <div className={styles.chart}>{chartRows}</div>

            <Button
                mode="tertiary" style={{paddingRight: 0}}
                onClick={() => setSelectedWeekDate(selectedWeekDate.clone().add(1, "week"))}
                disabled={selectedWeekDate.isSame(moment(), "week")}
            >
                <Icon24BrowserForward/>
            </Button>
        </div>
    );
};

export default StatsCompareChart;