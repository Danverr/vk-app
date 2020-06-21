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

    return (
        <ConfigProvider isWebView={true}>
            <Root activeView="Epic" popout={state.rootPopup}>
                <Epic id="Epic" activeStory={nav.activeStory} tabbar={nav.navbar}>
                    <FeedStory id="feed" state={state.feed} nav={nav}/>
                    <ProfilesStory id="profiles" state={state.profiles} nav={nav}/>
                    <CheckInStory id="checkIn" state={state.checkIn} nav={nav}/>
                    <CalendarStory id="calendar" state={state.calendar} nav={nav}/>
                    <SettingsStory id="settings" state={state.settings} nav={nav}/>
                </Epic>
            </Root>
        </ConfigProvider>
    );
};

export default App;