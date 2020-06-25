import React, {useMemo} from 'react';
import {Div, Title, Subhead, Placeholder} from "@vkontakte/vkui";
import {PieChart, Pie, Cell} from 'recharts';
import getColors from "../../../../utils/getColors";
import styles from "./statsCounter.module.css";
import moment from 'moment';

const pieLabel = ({cx, cy, midAngle, outerRadius, percent, fill}) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 8;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <>
            {/* Subhead regular */}
            <text className={styles.pieLabel} x={x} y={y} fill={fill}
                  transform={`rotate(${(x > cx ? 0 : 180) - midAngle} ${x},${y})`}
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        </>
    );
};

const getMean = (rawStats, lastDate) => {
    // Оставляем только записи за последние interval дней
    const stats = rawStats.filter((item) => {
        return item.date.valueOf() > lastDate.valueOf();
    });

    // Считаем среднее значение
    let mean = 0;

    if (stats.length) {
        mean = stats.reduce((sum, item) => sum + item.val, 0) / stats.length;
        mean = mean.toFixed(2);
    }

    return mean;
};

const getCounterData = (rawStats, lastDate, param) => {
    let data = [];

    // Оставляем только записи за последние interval дней
    const stats = rawStats.filter((item) => {
        return item.date.isAfter(lastDate);
    });

    // Считаем сколько каждой оценки было
    for (const stat of stats) {
        if (!(stat.val in data)) {
            data[stat.val] = {name: stat.val, val: 0}
        }

        data[stat.val].val++;
    }

    // Сначала должны идти высокие показатели если это настроение
    if (param === "mood") data.reverse();

    // Делаем корректные индексы
    data = data.filter(() => true);

    return data;
};

const StatsCounter = (props) => {
    const colors = getColors(props.activeParam);
    const interval = 30; // Кол-во предыдущих дней, за которые считаем статы
    const lastDate = moment().startOf("day").subtract(interval, "days");

    // Считаем среднее
    const mean = useMemo(() => {
        let mean = {};
        for (const param in props.stats)
            mean[param] = getMean(props.stats[param], lastDate);
        return mean;
    }, [props.stats, lastDate]);

    // Получаем данные для графика из стат
    const data = useMemo(() => {
        let data = {};
        for (const param in props.stats)
            data[param] = getCounterData(props.stats[param], lastDate, param);
        return data;
    }, [props.stats, lastDate]);

    // Если за последние interval дней записей нет, вернем Placeholder
    if (props.stats[props.activeParam].length === 0) {
        return (
            <Placeholder header="Недостаточно записей">
                Для счетчика нужна хотя бы одна запись за последние {interval} дней
            </Placeholder>
        );
    }

    return (
        <Div className={styles.flexContainer}>
            <div className={styles.flexGroup}>
                <PieChart width={75} height={200}>
                    <Pie
                        isAnimationActive={false}
                        data={data[props.activeParam]} dataKey="val" nameKey="name"
                        cx="100%" cy="50%" outerRadius="200%"
                        label={pieLabel} labelLine={false}
                        startAngle={90} endAngle={270}
                    >
                        {
                            data[props.activeParam].map((item, index) => (
                                <Cell key={index} fill={colors[item.name - 1]}/>
                            ))
                        }
                    </Pie>
                </PieChart>
                <div className={styles.textContainer}>
                    <Title level="1" weight="semibold">{mean[props.activeParam]}</Title>
                    <Subhead weight="regular">Среднее значение</Subhead>
                    <Subhead weight="regular">за последние {interval} дней</Subhead>
                </div>
            </div>
        </Div>
    )
};

export default StatsCounter;


