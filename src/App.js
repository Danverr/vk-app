import React, {useState, useEffect} from 'react';
import {Epic, Tabbar, TabbarItem, ConfigProvider, Root, ScreenSpinner} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import useUsersInfo from "./utils/useUsersInfo";
import useNav from "./utils/useNav";

import ProfilesStory from './panels/profiles/profilesStory';
import FeedStory from "./panels/feed/feedStory";
import CheckInStory from "./panels/checkIn/checkInStory";
import CalendarStory from "./panels/calendar/calendarStory";
import SettingsStory from "./panels/settings/settingsStory";

const App = () => {
    const nav = useNav();
    const usersInfo = useUsersInfo();
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

    // Когда загрузили данные о юзере, укажем его id
    useEffect(() => {
        if (usersInfo) {
            answer.userId = usersInfo[0].id;
            setAnswer(answer);
            setLoading(null);
        }
    }, [usersInfo]);

    // Добавляем обработчик события изменения истории для работы аппаратных кнопок
    useEffect(() => {
        window.addEventListener('popstate', nav.goBack);
    }, []);

    return (
        <Root popout={loading}>
            <ConfigProvider isWebView={true}>
                <Epic activeStory={nav.activeStory} tabbar={nav.navbar}>
                    <FeedStory id="feed" nav={nav}/>
                    <ProfilesStory id="profiles" nav={nav}/>
                    <CheckInStory id="checkIn" nav={nav} answer={answer} setAnswer={setAnswer} usersInfo={usersInfo}/>
                    <CalendarStory id="calendar" nav={nav}/>
                    <SettingsStory id="settings" nav={nav}/>
                </Epic>
            </ConfigProvider>
        </Root>
    );
};

export default App;

