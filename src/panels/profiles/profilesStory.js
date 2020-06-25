import React, {useCallback, useEffect, useState} from 'react';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import ChooseProfilePanel from './chooseProfile/chooseProfilePanel';
import UserProfilePanel from "./userProfile/userProfilePanel";
import api from "../../utils/api";
import bridge from "@vkontakte/vk-bridge";
import moment from 'moment';

// Меняем несколько записей за день на одну с их средним значением
// Среди всех принятых stats
const getMeanByDays = (stats) => {
    let meanStats = [];
    let date = null;
    let sum = 0;
    let count = 0;

    for (let stat of stats) {
        if (!date || !date.isSame(stat.date)) {
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

const fetchFriendsInfo = async (userToken) => {
    // ID друзей к которым есть доступ
    const friendsIdsPromise = await api("GET", "/statAccess/", {
        type: "fromId",
    });

    // Информация о друзьях
    const friendsInfoPromise = await bridge.send("VKWebAppCallAPIMethod", {
        method: "users.get",
        params: {
            access_token: userToken,
            v: "5.103",
            user_ids: friendsIdsPromise.data.join(","),
            fields: "photo_50, photo_100"
        }
    });

    return friendsInfoPromise.response.map((info) => {
        return {...info, "isCurrentUser": false};
    });
};

let localState = {
    activeUserProfile: null,
    usersInfo: null,
    stats: null,
};

const ProfilesStory = (props) => {
    const [activeUserProfile, setActiveUserProfile] = useState(localState.activeUserProfile);
    const [usersInfo, setUsersInfo] = useState(localState.usersInfo);
    const [stats, setStats] = useState(localState.stats);
    const {activePanel} = props.nav;
    const {userInfo, userToken} = props.state;

    // Обновляем локальный стейт
    useEffect(() => {
        localState = {
            activeUserProfile: activeUserProfile,
            usersInfo: usersInfo,
            stats: stats
        };
    }, [activeUserProfile, usersInfo, stats]);

    const formatStats = useCallback((data) => {
        let allStats = {
            mood: [],
            stress: [],
            anxiety: []
        };

        // Группируем статы по параметрам
        for (const stat of data) {
            // Переводим строки в Date с нулевым временем
            stat.date = moment(`${stat.date}Z`).startOf("day");

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
    }, []);

    // Загружаем данные о друзьях
    useEffect(() => {
        if (!userToken || !userInfo || activePanel !== "chooseProfile") return;

        fetchFriendsInfo(userToken).then((friendsInfo) => {
            const newUsersInfo = [userInfo, ...friendsInfo];
            setUsersInfo(newUsersInfo);

            // Загрузка статистики пользователей для карточек
            api("GET", "/entries/stats/", {
                users: newUsersInfo.map(info => info.id).join(","),
                startDate: moment().utc().subtract(7, "days").startOf("day").format("YYYY-MM-DD"),
            }).then((res) => {
                let newStats = {};

                for (const userId in res.data) {
                    newStats[userId] = formatStats(res.data[userId]);
                }

                setStats(newStats);
            });
        });
    }, [userToken, userInfo, activePanel, formatStats]);

    return (
        <View
            id={props.id}
            activePanel={activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >

            <ChooseProfilePanel
                id="chooseProfile"
                setActiveUserProfile={setActiveUserProfile}
                goToUserProfile={() => props.nav.goTo(props.id, "userProfile")}
                usersInfo={usersInfo}
                stats={stats}
            />

            <UserProfilePanel
                id="userProfile"
                userInfo={activeUserProfile}
                formatStats={formatStats}
                nav={props.nav}
            />

        </View>
    );
};

export default ProfilesStory;

