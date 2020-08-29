import React, {useRef, useEffect, useState} from 'react';
import {Div, Placeholder, Button} from '@vkontakte/vkui';
import moment from 'moment';
import styles from "./statsChart.module.css";

import StatsAreaChart from "../../../../components/statsAreaChart/statsAreaChart";

const getChartData = (allStats, selectedDate) => {
    let data = [];
    const curDate = moment.min(moment(), moment(selectedDate).endOf(SCROLL_STEP[1])).startOf("day");

    const stats = allStats.filter((item) => {
        const date = moment(item.date);
        return date.isSame(selectedDate, SCROLL_STEP[1]);
    });

    let i = stats.length - 1;

    // Проходимся по датам
    while (curDate.isSame(selectedDate, SCROLL_STEP[1])) {
        let d = {
            date: curDate.format(),
            val: null,
        };

        // Если текущая дата такая же, как и дата у самой новой записи в stats
        // То ставим значение из записи, иначе null
        if (i >= 0 && stats[i].date.isSame(curDate)) {
            d.val = stats[i].val;
            i--;
        }

        data.push(d);
        curDate.subtract(1, "day");
    }

    return data;
};

const areChartDataEqual = (prevStats, nextStats) => {
    if (!prevStats && !nextStats) return true;
    if (!prevStats || !nextStats || prevStats.length !== nextStats.length) return false;

    for (const i in nextStats) {
        if (nextStats[i].val !== prevStats[i].val || nextStats[i].date !== prevStats[i].date) {
            return false;
        }
    }

    return true;
};

const SCROLL_STEP = [1, "year"];

let localState = {
    userId: null,
    chartScroll: null,
    chart: null,
    selectedDate: moment().startOf(SCROLL_STEP[1]),
    activeData: null
};

const StatsChart = (props) => {
    // Сбрасываем скролл и дату, если юзер поменялся
    if (localState.userId !== props.userId) {
        localState.chartScroll = null;
        localState.selectedDate = moment().startOf(SCROLL_STEP[1]);
    }
    localState.userId = props.userId;

    const [selectedDate, setSelectedDate] = useState(localState.selectedDate);
    const chartScrollRef = useRef(null);

    // Обновляем дату и устанавливаем скролл графика
    useEffect(() => {
        localState.selectedDate = selectedDate;

        if (chartScrollRef && chartScrollRef.current) {
            if (localState.chartScroll === null) {
                chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
            } else {
                chartScrollRef.current.scrollLeft = localState.chartScroll;
            }
        }
    }, [selectedDate]);

    // При уходе сохраняем скролл
    useEffect(() => {
        const current = chartScrollRef && chartScrollRef.current ? chartScrollRef.current : null;

        return () => {
            if (current) {
                localState.chartScroll = current.scrollLeft;
            }
        }
    }, []);

    // Если записей нет, вернем Placeholder
    const stats = props.stats[props.activeParam];

    if (stats.length === 0) {
        return (
            <Placeholder>
                Для статистики нужна хотя бы одна запись.
            </Placeholder>
        );
    }

    // Получаем данные для графика из стат
    const activeData = getChartData(stats, selectedDate);

    if (!areChartDataEqual(activeData, localState.activeData)) {
        localState.activeData = activeData;
        localState.chart = <StatsAreaChart data={activeData} param={props.activeParam}/>;
    }

    return (
        <Div className={styles.chartContainer}>
            <div className={styles.chartScroll} ref={chartScrollRef}>

                <Button
                    mode="tertiary"
                    className={styles.prevDateButton}
                    onClick={() => {
                        localState.chartScroll = null;
                        setSelectedDate(moment(selectedDate).subtract(...SCROLL_STEP));
                    }}
                >
                    {moment(selectedDate).subtract(...SCROLL_STEP).format("YYYY")}
                </Button>

                {localState.chart}

                {
                    selectedDate.isSame(moment(), SCROLL_STEP[1]) ? null :
                        <Button
                            mode="tertiary"
                            className={styles.nextDateButton}
                            onClick={() => {
                                localState.chartScroll = 0;
                                setSelectedDate(moment(selectedDate).add(...SCROLL_STEP));
                            }}
                        >
                            {moment(selectedDate).add(...SCROLL_STEP).format("YYYY")}
                        </Button>
                }

            </div>
        </Div>
    );
};

export default StatsChart;