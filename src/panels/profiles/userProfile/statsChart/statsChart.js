import React, {useRef, useEffect, useMemo} from 'react';
import {Card, Div, Placeholder, Text, Caption} from '@vkontakte/vkui';
import {AreaChart, Area, XAxis, YAxis, Tooltip} from 'recharts';
import emoji from "../../../../assets/emoji/emojiList";
import styles from "./statsChart.module.css";

const TooltipCard = (props) => {
    const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];

    if (props.active && props.payload.length) {
        let {date, val} = props.payload[0].payload;
        date = new Date(date);

        return (
            <Card className={styles.tooltipCard} mode='shadow' size="s">
                <img src={props.emoji[Math.round(val) - 1]}/>

                <div className={styles.tooltipText}>
                    <Text weight="regular">
                        Среднее: {val}
                    </Text>
                    <Caption level="2" weight="regular" className={styles.tooltipCaption}>
                        {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}
                    </Caption>
                </div>
            </Card>
        );
    }

    return null;
};

const AxisTick = (props) => {
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const date = new Date(props.payload.value);
    let anchor = "middle";
    let monthText = "";

    if (props.index == 0) {
        anchor = "end";
    } else if (props.index == props.visibleTicksCount - 1) {
        anchor = "start";
    }

    if (date.getDate() == 1) {
        monthText = `${months[date.getMonth()]}`;

        if (date.getFullYear() != props.curDate.getFullYear()) {
            monthText += ` ${date.getFullYear()}`;
        }
    }

    return (
        <g transform={`translate(${props.x},${props.y})`}>
            {/* Subhead regular */}
            <text className={styles.tickDate} x={0} y={0} dy={0} textAnchor={anchor}>
                {date.getDate()}
            </text>

            {/* Subhead medium */}
            <text className={styles.tickMonth} x={0} y={0} dy={24} textAnchor={anchor}>
                {monthText}
            </text>
        </g>
    );
};

const getChartColors = (stats, count, param) => {
    const colors = ["var(--very_good)", "var(--good)", "var(--norm)", "var(--bad)", "var(--very_bad)"];
    if (param == "mood") colors.reverse();
    let mean = 0;

    // Cчитаем сумму
    for (let i = stats.length - 1; i >= Math.max(0, stats.length - count); i--) {
        mean += stats[i].val;
    }

    // Считаем среднее
    mean /= stats.length - Math.max(0, stats.length - count);

    return colors[Math.round(mean) - 1];
};

const getChartData = (stats, curDate) => {
    let data = [];
    curDate.setHours(0, 0, 0, 0);
    let i = stats.length - 1;

    // Проходимся по датам
    while (1) {
        let d = {
            date: curDate.toString(),
            val: null,
        };

        // Если текущая дата такая же, как и дата у самой новой записи в stats
        // То ставим значение из записи, иначе null
        if (i >= 0 && stats[i].date.getTime() == curDate.getTime()) {
            d.val = stats[i].val;
            i--;
        }

        data.push(d);

        // Чтобы закончили на начале месяца с последней записью
        if (i < 0 && curDate.getDate() == 1) break;
        curDate.setDate(curDate.getDate() - 1);
    }

    return data;
};

const StatsChart = (props) => {
    const chartScrollRef = useRef();

    // Меняем скролл, чтобы график начинался с конца и прокручивался влево
    useEffect(() => {
        if (chartScrollRef.current) {
            chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
        }
    });

    // Выбираем цвет для графика исходя из последних записей
    const chartColors = useMemo(() => {
        let chartColors = {};
        for (const param in props.stats)
            chartColors[param] = getChartColors(props.stats[param], 3, param);
        return chartColors;
    }, [props.stats]);

    // Получаем данные для графика из стат
    const data = useMemo(() => {
        let data = {};
        for (const param in props.stats)
            data[param] = getChartData(props.stats[param], props.now(), param);
        return data;
    }, [props.stats]);

    // Если записей нет, вернем Placeholder
    if (props.stats[props.activeParam].length == 0) {
        return (
            <Placeholder header="Недостаточно записей">
                Для отображения статистики нужно иметь хотя бы одну запись
            </Placeholder>
        );
    }

    return (
        <Div className={styles.chartContainer}>
            <div className={styles.chartScroll} ref={chartScrollRef}>
                <AreaChart data={data[props.activeParam]} width={data[props.activeParam].length * 32} height={300}>
                    <defs>
                        <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColors[props.activeParam]} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={chartColors[props.activeParam]} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area connectNulls={true} dot={true} type="monotoneX" dataKey="val"
                          stroke={chartColors[props.activeParam]} fill="url(#color)"/>
                    <XAxis height={40} dataKey="date" reversed={true}
                           tick={<AxisTick curDate={props.now()}/>}
                           interval={0} axisLine={false} tickMargin={12}/>
                    <YAxis dataKey="val" hide={true} domain={[0, 6]}/>
                    <Tooltip content={<TooltipCard emoji={emoji[props.activeParam]}/>}/>
                </AreaChart>
            </div>
        </Div>
    )
};

export default StatsChart;


