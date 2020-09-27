import React, {useEffect, useState} from 'react';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import ChooseProfilePanel from './chooseProfile/chooseProfilePanel';
import UserProfilePanel from "./userProfile/userProfilePanel";
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

const formatStats = (data) => {
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
};

let localState = {
    activeUserProfile: null
};

const ProfilesStory = (props) => {
    const [activeUserProfile, setActiveUserProfile] = useState(localState.activeUserProfile);
    const {activePanel} = props.nav;
    const {userInfo} = props.state;

    // Обновляем локальный стейт
    useEffect(() => {
        localState = {
            activeUserProfile: activeUserProfile
        };
    }, [activeUserProfile]);

    return (
        <View
            id={props.id}
            activePanel={activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={() => props.nav.goBack(true)}
        >

            <ChooseProfilePanel
                id="chooseProfile"
                setActiveUserProfile={setActiveUserProfile}
                goToUserProfile={() => props.nav.goTo(props.id, "userProfile")}
                userInfo={userInfo}
                formatStats={formatStats}
                isLightScheme={props.state.isLightScheme}
                activePanel={props.nav.activePanel}
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

