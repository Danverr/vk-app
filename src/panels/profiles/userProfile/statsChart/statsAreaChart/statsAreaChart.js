import React from 'react';
import {Caption, Card, Text} from "@vkontakte/vkui";
import {AreaChart, Area, XAxis, YAxis, Tooltip} from 'recharts';
import styles from "./statsAreaChart.module.css";
import moment from "moment";
import momentLocale from 'moment/locale/ru';

import getColors from "../../../../../utils/getColors";
import emoji from "../../../../../utils/getEmoji";

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

const getColor = (id, stats, param, islineColor) => {
    const max = stats.reduce((max, item) => Math.max(max, item.val), 0);
    const min = stats.reduce((min, item) => {
        const val = item.val === null ? 6 : item.val;
        return Math.min(min, val);
    }, 6);

    let colors = getColors(param);
    colors = colors.filter((item, index) => {
        index += 1;
        return index <= max && (!islineColor || index >= min);
    });
    colors.reverse();

    const step = 1 / (colors.length - islineColor);
    let offset = max - Math.floor(max);
    let stops = [];

    for (let i = 0; i < colors.length; i++) {
        stops.push(<stop key={`${id} ${i}_begin`} offset={offset} stopColor={colors[i]} stopOpacity={1}/>);
        offset += i === 0 || i === colors.length - 1 ? step / 2 : step;
        stops.push(<stop key={`${id} ${i}_end`} offset={offset} stopColor={colors[i]} stopOpacity={1}/>);
    }

    if (!islineColor) {
        stops.push(<stop key={`${id} gradEnd`} offset={1} stopColor={colors[colors.length - 1]} stopOpacity={0}/>);
    }

    return (
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            {stops}
        </linearGradient>
    );
};

const StatsAreaChart = (props) => {
    const CHART_TICK_WIDTH = 32;
    const {data, param} = props;

    return (
        <AreaChart data={data} width={data.length * CHART_TICK_WIDTH} height={300}>
            <defs>
                {getColor("fillColor", data, param, false)}
                {getColor("strokeColor", data, param, true)}
            </defs>
            <Area
                animationDuration={1000} connectNulls={true} type="monotoneX" dataKey="val"
                stroke="url(#strokeColor)" strokeWidth={2} fill="url(#fillColor)"
                dot={{fill: "var(--background_content)", stroke: 'var(--light_accent)'}}
                activeDot={{fill: "var(--background_content)", stroke: 'var(--accent)'}}
            />
            <XAxis
                height={40} dataKey="date" reversed={true}
                tick={<AxisTick/>} interval={0} axisLine={false} tickMargin={12}
            />
            <YAxis dataKey="val" hide={true} domain={[0, 5.5]}/>
            <Tooltip
                content={<TooltipCard emoji={emoji[param]}/>}
                cursor={false} coordinate={{x: 100, y: 140}}
            />
        </AreaChart>
    );
};

export default StatsAreaChart;