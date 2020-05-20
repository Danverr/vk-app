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

import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28SmileOutline from '@vkontakte/icons/dist/28/smile_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28CalendarOutline from '@vkontakte/icons/dist/28/calendar_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

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
                <Epic activeStory={nav.activeStory} tabbar={
                    <Tabbar>
                        <TabbarItem
                            onClick={() => nav.goTo("feed")}
                            selected={nav.activeStory === "feed"}
                        ><Icon28NewsfeedOutline/></TabbarItem>
                        <TabbarItem
                            onClick={() => nav.goTo("profiles")}
                            selected={nav.activeStory === "profiles"}
                        ><Icon28SmileOutline/></TabbarItem>
                        <TabbarItem
                            onClick={() => nav.goTo("checkIn")}
                            selected={nav.activeStory === "checkIn"}
                        ><Icon28AddCircleOutline/></TabbarItem>
                        <TabbarItem
                            onClick={() => nav.goTo("calendar")}
                            selected={nav.activeStory === "calendar"}
                        ><Icon28CalendarOutline/></TabbarItem>
                        <TabbarItem
                            onClick={() => nav.goTo("settings")}
                            selected={nav.activeStory === "settings"}
                        ><Icon28SettingsOutline/></TabbarItem>
                    </Tabbar>
                }>
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

