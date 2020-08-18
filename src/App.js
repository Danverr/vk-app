import React, {useEffect} from "react";
import {Epic, Root, ConfigProvider} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import moment from "moment";

import useAppState from "./utils/useAppState";
import useNav from "./utils/useNav";

import BannedView from './panels/bannedView/bannedView';
import GlobalErrorView from "./panels/globalError/globalErrorView";
import LoadingScreen from "./panels/loadingScreen/loadingScreen";
import IntroView from "./panels/intro/introView";

import ProfilesStory from "./panels/profiles/profilesStory";
import FeedStory from "./panels/feed/feedStory";
import CheckInStory from "./panels/checkIn/checkInStory";
import CalendarStory from "./panels/calendar/calendarStory";
import SettingsStory from "./panels/settings/settingsStory";

const startTime = moment();

const logAppState = (state, nav) => {
    const getTimeElapsed = (start) => {
        let ms = moment().diff(start);

        let s = Math.floor(ms / 1000);
        ms %= 1000;

        let m = Math.floor(s / 60);
        s %= 60;

        if (ms < 10) ms = "00" + m;
        else if (ms < 100) ms = "0" + ms;
        if (s < 10) s = "0" + s;
        if (m < 10) m = "0" + m;

        return `${m}:${s}:${ms}`;
    };

    console.group(getTimeElapsed(startTime));
    console.log("VK Storage: ", state.vkStorage._values);
    console.log("View history: ", nav.viewHistory);
    console.log("Current panel history: ", nav.panelHistory[nav.activeStory]);
    console.log("Scroll history: ", nav.scrollHistory);
    console.groupEnd();
};

const App = () => {
    // Состояние и навигация приложения
    const state = useAppState();
    const nav = useNav();
    const {goBack} = nav;

    // Добавляем обработчик события изменения истории для работы аппаратных кнопок
    useEffect(() => {
        window.addEventListener('popstate', goBack);
    }, [goBack]);

    if (!state.loading) {
        logAppState(state, nav);

        if (state.globalError) nav.goTo("globalError");
        else if (state.isBanned) nav.goTo("banned");
        else if (state.vkStorage.getValue("showIntro")) nav.goTo("intro");
    }

    return (
        <ConfigProvider isWebView>
            <Root activeView="Epic">
                <Epic
                    id="Epic"
                    className={nav.navbar ? "" : "hideNavbar"}
                    activeStory={state.loading ? "loadingScreen" : nav.activeStory}
                    tabbar={nav.navbar}
                >
                    <BannedView id="banned" state={state} nav={nav}/>
                    <GlobalErrorView id="globalError" error={state.globalError} nav={nav}/>
                    <LoadingScreen id="loadingScreen" state={state} nav={nav}/>
                    <IntroView id="intro" state={state} nav={nav}/>

                    <FeedStory id="feed" state={state} nav={nav}/>
                    <ProfilesStory id="profiles" state={state} nav={nav}/>
                    <CheckInStory id="checkIn" state={state} nav={nav}/>
                    <CalendarStory id="calendar" state={state} nav={nav}/>
                    <SettingsStory id="settings" state={state} nav={nav}/>
                </Epic>
            </Root>

        </ConfigProvider>
    );
};

export default App;
