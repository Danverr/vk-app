import React, { useEffect} from 'react';
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
    const {goBack} = nav;

    // Добавляем обработчик события изменения истории для работы аппаратных кнопок
    useEffect(() => {
        window.addEventListener('popstate', goBack);
    }, [goBack]);

    return (
        <ConfigProvider isWebView={true}>
            <Root activeView="Epic" popout={state.rootPopup}>
                <Epic id="Epic" activeStory={nav.activeStory} tabbar={nav.navbar}>
                    <FeedStory id="feed" state={state} nav={nav}/>
                    <ProfilesStory id="profiles" state={state} nav={nav}/>
                    <CheckInStory id="checkIn" state={state} nav={nav}/>
                    <CalendarStory id="calendar" state={state} nav={nav} />
                    <SettingsStory id="settings" state={state.settings} nav={nav} />
                </Epic>
            </Root>
        </ConfigProvider>
    );
};

export default App;
