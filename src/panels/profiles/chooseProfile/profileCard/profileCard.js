import React from 'react';
import {Avatar, Card, Cell, Div, Placeholder, Subhead} from "@vkontakte/vkui";
import styles from "./profileCard.module.css";
import {Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";

const Chart = (data, param) => {
    const colors = ["var(--very_good)", "var(--good)", "var(--norm)", "var(--bad)", "var(--very_bad)"];
    if (param == "Настроение") colors.reverse();

    if (!data || data.length < 2) {
        return null;
    }

    let mean = data.reduce((sum, item) => sum + item.val, 0) / data.length;
    const color = colors[Math.round(mean) - 1];

    return (
        <div className={styles.chartContainer}>

            <Subhead weight="regular" className={styles.chartName}>
                {param}
            </Subhead>

            <ResponsiveContainer width="100%" height={64}>
                <LineChart data={data}>
                    <Line connectNulls={true} type="monotoneX" dataKey="val" stroke={color} strokeWidth={2}/>
                    <XAxis dataKey="date" hide={true}/>
                    <YAxis dataKey="val" hide={true} domain={[0, 6]}/>
                </LineChart>
            </ResponsiveContainer>

        </div>
    );
};

const ProfileCard = (props) => {
    const charts = [
        Chart(props.stats.mood, "Настроение"),
        Chart(props.stats.stress, "Стресс"),
        Chart(props.stats.anxiety, "Тревожность")
    ];

    return (
        <Card key={props.info.id} size="l" mode="shadow" onClick={() => {
            props.goToUserProfile();
            props.setActiveUserProfile(props.info);
        }}>
            <Div>

                <Cell className={styles.avatarCell} before={<Avatar src={props.info.photo_100}/>}>
                    {`${props.info.first_name} ${props.info.last_name}`}
                </Cell>

                {
                    charts.reduce((sum, item) => sum + (item == null), 0) != charts.length ? charts :
                        <Placeholder header="Недостаточно записей">
                            Для краткой статистики нужно хотя бы 2 записи за последние 7 дней
                        </Placeholder>
                }

            </Div>
        </Card>
    );
};

export default ProfileCard;