import React from 'react';
import {Avatar, Card, Cell, Group, Placeholder, Subhead} from "@vkontakte/vkui";
import styles from "./profileCard.module.css";
import {Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import getColors from "../../../../utils/getColors";

const areChartsEqual = (prevProps, nextProps) => {
    let areEqual = true;

    if (prevProps.param === nextProps.param && prevProps.data.length === nextProps.data.length) {
        for (let i = 0; i < prevProps.data.length; i++) {
            const prevData = prevProps.data[i];
            const nextData = nextProps.data[i];

            if (!prevData.date.isSame(nextData.date) || prevData.val !== nextData.val) {
                areEqual = false;
                break;
            }
        }
    } else {
        areEqual = false;
    }

    return areEqual;
};

const Chart = React.memo(({data, param, title}) => {
    const colors = getColors(param);

    if (!data || data.length < 2) {
        return null;
    }

    let mean = data.reduce((sum, item) => sum + item.val, 0) / data.length;
    const color = colors[Math.round(mean) - 1];

    return (
        <Group className={styles.chartContainer}>

            <Subhead weight="regular" className={styles.chartName}>
                {title}
            </Subhead>

            <ResponsiveContainer width="100%" height={64}>
                <LineChart data={data}>
                    <Line
                        animationDuration={1000} type="monotoneX" dataKey="val" dot={true} connectNulls={true}
                        stroke={color} strokeWidth={2}
                    />
                    <XAxis dataKey="date" hide={true}/>
                    <YAxis dataKey="val" hide={true} domain={[1, 5]}/>
                </LineChart>
            </ResponsiveContainer>

        </Group>
    );
}, areChartsEqual);

const ProfileCard = (props) => {
    return (
        <Card className={styles.profileCard} size="l" mode="shadow" onClick={() => {
            props.goToUserProfile();
            props.setActiveUserProfile(props.info);
        }}>

            <Cell className={styles.avatarCell} before={<Avatar src={props.info.photo_100}/>}>
                {`${props.info.first_name} ${props.info.last_name}`}
            </Cell>

            {
                Object.values(props.stats).find(stats => stats.length < 2) !== undefined ?

                    <Placeholder header="Недостаточно записей">
                        Для краткой статистики нужно хотя бы 2 записи за последние 7 дней
                    </Placeholder>

                    :

                    <>
                        <Chart data={props.stats.mood} param={"mood"} title={"Настроение"}/>
                        <Chart data={props.stats.stress} param={"stress"} title={"Стресс"}/>
                        <Chart data={props.stats.anxiety} param={"anxiety"} title={"Тревожность"}/>
                    </>
            }

        </Card>
    );
};

export default ProfileCard;