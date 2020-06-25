import React, {useRef, useEffect, useMemo} from 'react';
import {Card, Div, Placeholder, Text, Caption} from '@vkontakte/vkui';
import {AreaChart, Area, XAxis, YAxis, Tooltip} from 'recharts';
import moment from 'moment';
import momentLocale from 'moment/locale/ru';

import emoji from "../../../../utils/getEmoji";
import styles from "./statsChart.module.css";
import getColors from "../../../../utils/getColors";

moment.locale("ru", momentLocale);

const TooltipCard = (props) => {
    if (props.active && props.payload.length) {
        let {date, val} = props.payload[0].payload;

        return (
            <Card className={styles.tooltipCard} mode='shadow' size="s">
                <img src={props.emoji[Math.round(val) - 1]} alt=""/>

                <div className={styles.tooltipText}>
                    <Text weight="medium">
                        Среднее: {val}
                    </Text>
                    <Caption level="2" weight="regular" className={styles.tooltipCaption}>
                        {moment(date).locale("ru").format("D MMMM YYYY")}
                    </Caption>
                </div>
            </Card>
        );
    }

    return null;
};

const AxisTick = (props) => {
    const date = moment(props.payload.value);
    let anchor = "middle";
    let dateFormat = "";

    if (props.index === 0) {
        anchor = "end";
    } else if (props.index === props.visibleTicksCount - 1) {
        anchor = "start";
    }

    if (date.date() === 1) {
        dateFormat += "MMM";

        if (!date.isSame(props.curDate, "year")) {
            dateFormat += " YYYY";
        }
    }

    return (
        <g transform={`translate(${props.x},${props.y})`}>
            {/* Subhead regular */}
            <text className={styles.tickDate} x={0} y={0} dy={0} textAnchor={anchor}>
                {date.date()}
            </text>

            {/* Subhead medium */}
            <text className={styles.tickMonth} x={0} y={0} dy={24} textAnchor={anchor}>
                {dateFormat.length ? date.format(dateFormat) : ""}
            </text>
        </g>
    );
};

const getChartColors = (stats, daysAgo, param) => {
    const colors = getColors(param);
    const start = moment().startOf("day").subtract(daysAgo, "days");
    const lastStats = stats.filter(stat => stat.date.isAfter(start));

    if (lastStats.length) {
        const mean = lastStats.reduce((sum, item) => sum + item.val, 0) / lastStats.length;
        return colors[Math.round(mean) - 1];
    } else {
        return "var(--default_chart_color)";
    }
};

const getChartData = (stats) => {
    let data = [];
    const curDate = moment().startOf("day");
    let i = stats.length - 1;

    // Проходимся по датам
    while (1) {
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

        // Чтобы закончили на начале месяца с последней записью
        if (i < 0 && curDate.date() === 1) break;
        curDate.subtract(1, "day");
    }

    return data;
};

const StatsChart = (props) => {
    const chartScrollRef = useRef(null);
    const {stats} = props;

    // Меняем скролл, чтобы график начинался с конца и прокручивался влево
    useEffect(() => {
        if (chartScrollRef && chartScrollRef.current) {
            chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
        }
    }, []);

    // Выбираем цвет для графика исходя из последних записей
    const chartColors = useMemo(() => {
        let chartColors = {};
        for (const param in stats)
            chartColors[param] = getChartColors(stats[param], 7, param);
        return chartColors;
    }, [stats]);

    const activeColor = chartColors[props.activeParam];

    // Получаем данные для графика из стат
    const data = useMemo(() => {
        let data = {};
        for (const param in stats)
            data[param] = getChartData(stats[param]);
        return data;
    }, [stats]);

    // Если записей нет, вернем Placeholder
    if (stats[props.activeParam].length === 0) {
        return (
            <Placeholder header="Недостаточно записей">
                Для статистики нужна хотя бы одна запись
            </Placeholder>
        );
    }

    return (
        <Div className={styles.chartContainer}>
            <div className={styles.chartScroll} ref={chartScrollRef}>
                <AreaChart data={data[props.activeParam]} width={data[props.activeParam].length * 32} height={300}>
                    <defs>
                        <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={activeColor} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={activeColor} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area
                        animationDuration={1000} connectNulls={true} type="monotoneX" dataKey="val"
                        stroke={activeColor} strokeWidth={2} fill="url(#color)"
                        dot={true} activeDot={{strokeWidth: 3, r: 6}}
                    />
                    <XAxis
                        height={40} dataKey="date" reversed={true}
                        tick={<AxisTick/>} interval={0} axisLine={false} tickMargin={12}
                    />
                    <YAxis dataKey="val" hide={true} domain={[0, 6]}/>
                    <Tooltip
                        content={<TooltipCard emoji={emoji[props.activeParam]}/>}
                        cursor={false} coordinate={{x: 100, y: 140}}
                    />
                </AreaChart>
            </div>
        </Div>
    )
};

const areEqual = (prevProps, nextProps) => {
    return prevProps.activeParam === nextProps.activeParam && prevProps.stats === nextProps.stats;
};

export default React.memo(StatsChart, areEqual);


