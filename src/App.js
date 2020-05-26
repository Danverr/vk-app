<<<<<<< HEAD
import React, {useEffect, useState} from 'react';
import {Epic, Tabbar, TabbarItem} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28SmileOutline from '@vkontakte/icons/dist/28/smile_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28CalendarOutline from '@vkontakte/icons/dist/28/calendar_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

import Profiles from './panels/profiles/profiles';
import Feed from "./panels/feed/feed";
import CheckIn from "./panels/checkIn/checkIn";
import Calendar from "./panels/calendar/calendar";
import Settings from "./panels/settings/settings";
import bridge from "@vkontakte/vk-bridge";
import api from "./utils/api";

const App = () => {
    let [activeStory, setStory] = useState("profiles");
    let [usersInfo, setUsersInfo] = useState(null);

    useEffect(() => {
        // Загрузка информации о пользователе и о друзьях, к которым есть доступ
        // Сначала идут сведения о текущем пользователе
        const fetchUsersInfo = async () => {
            if (usersInfo != null) return;

            const currentUserInfo = await bridge.send('VKWebAppGetUserInfo');

            const friendsIdsPromise = await api("GET", "/statAccess/", {
                userId: currentUserInfo.id,
            });

            const friendsInfoPromise = await api("GET", "/vk/users/", {
                userIds: friendsIdsPromise.data,
            });

            friendsInfoPromise.data.unshift(currentUserInfo);
            setUsersInfo(friendsInfoPromise.data);
        };

        fetchUsersInfo();
    });

    return (
        <Epic activeStory={activeStory} tabbar={
            <Tabbar>
                <TabbarItem
                    onClick={() => setStory("feed")}
                    selected={activeStory === "feed"}
                ><Icon28NewsfeedOutline/></TabbarItem>
                <TabbarItem
                    onClick={() => setStory("profiles")}
                    selected={activeStory === "profiles"}
                ><Icon28SmileOutline/></TabbarItem>
                <TabbarItem
                    onClick={() => setStory("checkIn")}
                    selected={activeStory === "checkIn"}
                ><Icon28AddCircleOutline/></TabbarItem>
                <TabbarItem
                    onClick={() => setStory("calendar")}
                    selected={activeStory === "calendar"}
                ><Icon28CalendarOutline/></TabbarItem>
                <TabbarItem
                    onClick={() => setStory("settings")}
                    selected={activeStory === "settings"}
                ><Icon28SettingsOutline/></TabbarItem>
            </Tabbar>
        }>
            <Feed id="feed"/>
            <Profiles id="profiles" usersInfo={usersInfo}/>
            <CheckIn id="checkIn"/>
            <Calendar id="calendar"/>
            <Settings id="settings"/>
        </Epic>
=======
import React, {useState, useEffect} from 'react';
import {Epic, Root, ConfigProvider, ScreenSpinner} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import useNav from "./utils/useNav";
import useUserToken from "./utils/useUserToken";
import useUsersInfo from "./utils/useUsersInfo";
import useUserEntries from "./utils/useUserEntries";

import ProfilesStory from './panels/profiles/profilesStory';
import FeedStory from "./panels/feed/feedStory";
import CheckInStory from "./panels/checkIn/checkInStory";
import CalendarStory from "./panels/calendar/calendarStory";
import SettingsStory from "./panels/settings/settingsStory";

const App = () => {
    const nav = useNav();
    const userToken = useUserToken();
    const usersInfo = useUsersInfo(userToken);
    let userEntries = useUserEntries(usersInfo);
    const [loading, setLoading] = useState(<ScreenSpinner/>);
    const [answer, setAnswer] = useState({
        userId: null,
        mood: null,
        stress: null,
        anxiety: null,
        title: "",
        note: "",
        isPublic: 0,
    });

    // Когда загрузили данные о юзерах, добавляем id в ответ
    useEffect(() => {
        if (usersInfo) {
            answer.userId = usersInfo[0].id;
            setAnswer(answer);
        }
    }, [usersInfo]);

    // Когда загрузили записи, убираем спиннер загрузки
    useEffect(() => {
        if (userEntries && usersInfo) {
            setLoading(null);
        }
    }, [userEntries, usersInfo]);

    // Добавляем обработчик события изменения истории для работы аппаратных кнопок
    useEffect(() => {
        window.addEventListener('popstate', nav.goBack);
    }, []);

    return (
        <Root popout={loading}>
            <ConfigProvider isWebView={true}>
                <Epic activeStory={nav.activeStory} tabbar={nav.navbar}>
                    <FeedStory id="feed" nav={nav}/>
                    <ProfilesStory id="profiles" nav={nav} usersInfo={usersInfo} userEntries={userEntries}/>
                    <CheckInStory id="checkIn" nav={nav}/>
                    <CalendarStory id="calendar" nav={nav}/>
                    <SettingsStory id="settings" nav={nav}/>
                </Epic>
            </ConfigProvider>
        </Root>
>>>>>>> chart
    );
};

export default App;

