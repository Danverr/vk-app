import React, {useState, useEffect} from 'react';
import {Epic, Root, ConfigProvider, ScreenSpinner} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import useAppState from "./utils/useAppState";
import useNav from "./utils/useNav";

import ProfilesStory from './panels/profiles/profilesStory';
import FeedStory from "./panels/feed/feedStory";
import CheckInStory from "./panels/checkIn/checkInStory";
import CalendarStory from "./panels/calendar/calendarStory";
import SettingsStory from "./panels/settings/settingsStory";

const App = () => {
    // Состояние и навигация приложения
    const state = useAppState();
    const nav = useNav();

    // Добавляем обработчик события изменения истории для работы аппаратных кнопок
    useEffect(() => {
        window.addEventListener('popstate', nav.goBack);
    }, []);

    console.log(usersInfo);
    return (
        <Root popout={state.rootPopup}>
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