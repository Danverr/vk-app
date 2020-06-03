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
    const userEntries = useUserEntries(usersInfo);
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

    console.log(usersInfo);
    return (
        <Root popout={loading}>
            <ConfigProvider isWebView={true}>
                <Epic activeStory={nav.activeStory} tabbar={nav.navbar}>
                    <FeedStory id="feed" nav={nav}/>
                    <ProfilesStory id="profiles" nav={nav}/>
                    <CheckInStory id="checkIn" nav={nav}/>
                    <CalendarStory id="calendar" nav={nav}/>
                    <SettingsStory id="settings" nav={nav} usersInfo = {usersInfo} userToken = {userToken}/>
                </Epic>
            </ConfigProvider>
        </Root>
    );
};

export default App;

