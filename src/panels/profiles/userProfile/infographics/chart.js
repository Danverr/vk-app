import React, {useRef, useEffect} from 'react';
import {Card, Div} from '@vkontakte/vkui';
import {AreaChart, ResponsiveContainer, Area, XAxis, YAxis, Tooltip} from 'recharts';
import styles from "./chart.module.css";
import emoji from "../../../../assets/emoji/emojiList";

const formatStats = (stats) => {
    // Переводим строки в Date с нулевым временем
    stats.map((stat) => {
        stat.date = new Date(stat.date);
        stat.date.setHours(0, 0, 0, 0);
    });

    // Меняем несколько записей за день на одну с их средним значением
    let meanStats = [];
    let date = null;
    let sum = 0;
    let count = 0;

    for (let stat of stats) {
        if (!date || date.getTime() != stat.date.getTime()) {
            if (date) {
                // Cчитаем среднее и округляем до сотых
                meanStats.push({
                    val: +(sum / count).toFixed(2),
                    date: date
                });

                sum = 0;
                count = 0;
            }

            date = stat.date;
        }

        sum += stat.val;
        count++;
    }

    if (date) {
        meanStats.push({
            val: +(sum / count).toFixed(2),
            date: date
        });
    }

    // В конце должны быть новые записи
    meanStats.reverse();

    return meanStats;
};

const TooltipCard = (props) => {
    const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];

    if (props.active && props.payload.length) {
        let {date, val} = props.payload[0].payload;
        date = new Date(date);

        return (
            <Card className={styles.tooltipCard} mode='shadow' size="s">
                <div className={styles.tooltipCardValue}>
                    <span>Среднее: {val}</span>
                    <img src={emoji.mood[Math.round(val) - 1]}/>
                </div>

                <div className={styles.tooltipCardDate}>
                    {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}
                </div>
            </Card>
        );
    }

    return null;
};

const AxisTick = (props) => {
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const curDate = new Date();
    const date = new Date(props.payload.value);
    let monthAnchor = "middle";
    let monthText = "";

    if (props.index == 0) {
        monthAnchor = "end";
    } else if (props.index == props.visibleTicksCount - 1) {
        monthAnchor = "start";
    }

    if (date.getDate() == 1) {
        monthText = `${months[date.getMonth()]}`;

        if (date.getFullYear() != curDate.getFullYear()) {
            monthText += ` ${date.getFullYear()}`;
        }
    }

    return (
        <g transform={`translate(${props.x},${props.y})`}>
            <text className={styles.tickDate} x={0} y={0} dy={0} textAnchor="middle">
                {date.getDate()}
            </text>

            <text className={styles.tickMonth} x={0} y={0} dy={24} textAnchor={monthAnchor}>
                {monthText}
            </text>
        </g>
    );
};

const getColors = (stats, days) => {
    const colors = ["var(--very_bad)", "var(--bad)", "var(--norm)", "var(--good)", "var(--very_good)"];
    let mean = 0;

    for (let i = stats.length - 1; i >= Math.max(0, stats.length - days); i--) {
        mean += stats[i].val;
    }

    mean /= stats.length - Math.max(0, stats.length - days);

    return {
        topBorder: colors[Math.ceil(mean) - 1],
        bottomBorder: colors[Math.floor(mean) - 1]
    };
};

const getChartData = (stats) => {
    let data = [];

    let curDate = new Date();
    curDate.setHours(0, 0, 0, 0);

    let endDate = new Date(curDate.getTime());
    endDate.setMonth(endDate.getMonth() - 12, 1);

    // Проходимся по всем датам за год
    while (curDate >= endDate) {
        let d = {
            date: curDate.toString(),
            val: null,
        };

        // Если текущая дата такая же, как и дата у самой новой записи в stats
        // То ставим значение из записи, иначе null
        if (stats.length && stats[stats.length - 1].date.getTime() == curDate.getTime()) {
            d.val = stats[stats.length - 1].val;
            stats.pop();
        }

        data.push(d);
        curDate.setDate(curDate.getDate() - 1);
    }

    return data;
};

const Chart = (props) => {
    const chartScrollRef = useRef();

    // Переводим данные в нужный нам формат
    const stats = formatStats(props.stats);

    // Выбираем цвет для графика исходя из последних записей
    const colors = getColors(stats, 30);

    // Получаем данные для графика из стат
    const data = getChartData(stats);

    // Меняем скролл, чтобы график начинался с конца и прокручивался влево
    useEffect(() => {
        chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
    }, []);

    return (
        <Div className={styles.chartContainer}>
            <div className={styles.chartScroll} ref={chartScrollRef}>
                <AreaChart data={data} width={data.length * 32} height={200}>
                    <defs>
                        <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.topBorder} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={colors.bottomBorder} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area connectNulls={true} dot={true} type="monotoneX" dataKey="val"
                          stroke={colors.topBorder} fill="url(#color)"/>
                    <XAxis height={40} dataKey="date" reversed={true} tick={<AxisTick/>} interval={0} axisLine={false}
                           tickMargin={12}/>
                    <YAxis dataKey="val" hide={true} domain={[0, 5]}/>
                    <Tooltip content={<TooltipCard/>}/>
                </AreaChart>
            </div>
        </Div>
    )
};

export default Chart;


