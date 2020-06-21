import React, {useState, useEffect} from 'react';
import {View, Spinner} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import ChooseProfilePanel from './chooseProfile/chooseProfilePanel';
import UserProfilePanel from "./userProfile/userProfilePanel";
import api from "../../utils/api";

// Меняем несколько записей за день на одну с их средним значением
// Среди всех принятых stats
const getMeanByDays = (stats) => {
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

    return meanStats;
};

const ProfilesStory = (props) => {
    const formatStats = (data) => {
        // Инициализируем переменную
        let allStats = {
            mood: [],
            stress: [],
            anxiety: []
        };

        // Группируем статы по параметрам
        for (const stat of data) {
            // Переводим строки в Date с нулевым временем
            stat.date = new Date(stat.date);
            stat.date.setHours(stat.date.getHours() + props.state.timezone);
            stat.date.setHours(0, 0, 0, 0);

            for (const param in allStats) {
                allStats[param].push({
                    id: stat.entryId,
                    val: stat[param],
                    date: stat.date
                });
            }
        }

        let meanByDaysStats = {};

        for (const param in allStats) {
            // В конце должны быть новые записи
            allStats[param].reverse();

            meanByDaysStats[param] = getMeanByDays(allStats[param]);
        }

        return {
            all: allStats,
            meanByDays: meanByDaysStats
        };
    };

    const [stats, setStats] = useState(null);

    // Загрузка статистики пользователя
    useEffect(() => {
        if (props.state.usersInfo == null) return;
        const startDate = props.state.now();
        startDate.setDate(startDate.getDate() - 7);

        api("GET", "/entries/stats/", {
            users: props.state.usersInfo.map(info => info.id).join(","),
            startDate: startDate.toISOString().substr(0, 10),
        }).then((res) => {
            let newStats = {};

            Object.keys(res.data).map((userId) => {
                newStats[userId] = formatStats(res.data[userId]);
            });

            setStats(newStats);
        });
    }, [props.state.usersInfo]);

    useEffect(() => {
        props.state.fetchFriendsInfo();
    }, []);

    return (
        <View
            id={props.id}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >

            <ChooseProfilePanel
                id="chooseProfile"
                setActiveUserProfile={props.state.setActiveUserProfile}
                goToUserProfile={() => props.nav.goTo(props.id, "userProfile")}
                usersInfo={props.state.usersInfo}
                stats={stats}
            />

            <UserProfilePanel
                id="userProfile"
                now={props.state.now}
                userInfo={props.state.activeUserProfile}
                formatStats={formatStats}
            />

        </View>
    );
};

export default ProfilesStory;

