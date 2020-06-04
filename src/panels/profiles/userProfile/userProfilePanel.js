import React, {useState, useEffect, useRef} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {
    Panel, PanelHeader, PanelHeaderBack,
    Cell, Header, Avatar, Group
} from "@vkontakte/vkui";
import styles from "./userProfilePanel.module.css";
import lottie from "lottie-web";

import avatarAnim from "../../../assets/sticker.json";
import Chart from "./infographics/chart";
import api from "../../../utils/api";

const UserProfilePanel = (props) => {
    const petContainerRef = useRef();
    let [stats, setStats] = useState([]);

    // Загрузка статистики пользователя
    useEffect(() => {
        if (props.userInfo == null) return;

        api("GET", "/entries/stats/", {
            userId: props.userInfo.id,
        }).then((res) => {
            setStats(res.data);
        });
    }, [props.userInfo]);

    // Устанавливаем размеры контейнера анимации
    useEffect(() => {
        // Отрисовываем аватара
        lottie.loadAnimation({
            container: petContainerRef.current, // the dom element
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: avatarAnim, // the animation data
        });
    }, []);

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false}
                         left={<PanelHeaderBack onClick={() => window.history.back()}/>}>
                Профиль
            </PanelHeader>

            <Group>
                <Cell before={<Avatar src={props.userInfo.photo_100}/>}>
                    {`${props.userInfo.first_name} ${props.userInfo.last_name}`}
                </Cell>
                <div className={styles.petContainer} ref={petContainerRef}/>
            </Group>

            <Group header={<Header mode="secondary">Cтатистика</Header>}>
                <Chart stats={stats.map(stat => ({val: stat.mood, date: stat.date}))}/>
            </Group>
        </Panel>
    );
};

export default UserProfilePanel;

