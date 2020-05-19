import React, {useState, useEffect} from 'react';
import {Epic, Tabbar, TabbarItem, ConfigProvider} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import useUsersInfo from "./utils/useUsersInfo";
import useNav from "./utils/useNav";

import ProfilesStory from './panels/profiles/profilesStory';
import FeedStory from "./panels/feed/feedStory";
import CheckInStory from "./panels/checkIn/checkInStory";
import CalendarStory from "./panels/calendar/calendarStory";
import SettingsStory from "./panels/settings/settingsStory";

// Панели по умолчанию для каждого view
const defaultPanels = {
    feed: "main",
    profiles: "main",
    checkIn: "main",
    calendar: "main",
    settings: "main",
};

// История панелей последнего view
const getLastViewHistory = (history) => {
    let viewHistory = [];
    let lastView = history[history.length - 1].story;

    for (let i = history.length - 1; i >= 0 && history[i].story === lastView; i--) {
        viewHistory.push(history[i].panel);
    }

    viewHistory.reverse();
    return viewHistory;
};

const App = () => {
    const [navState, setNavState] = useState({
        story: "profiles",
        panel: defaultPanels["profiles"],
    });
    let [usersInfo, setUsersInfo] = useState(null);
    const [history, setHistory] = useState([navState]);

    // Функция возврата с экрана
    const goBack = () => {
        if (history.length === 1) {
            // Отправляем bridge на закрытие сервиса.
            bridge.send("VKWebAppClose", {"status": "success"});
        } else {
            // Обновляем историю и текущее состояние
            history.pop();
            setHistory(history);
            setNavState(history[history.length - 1]);
        }

        // Убираем iOS Swipe Back
        // Таким образом VKUI свайп не будет конфликтовать со свайпом нативного клиента
        if (history.length === 1) {
            bridge.send('VKWebAppDisableSwipeBack');
        }

        console.log(history);
    };

    // Функция для перехода на другой экран
    const goTo = (story, panel = null) => {
        if (navState.story === story && navState.panel === panel) return;

        const state = {
            story: story,
            panel: panel === null ? defaultPanels[story] : panel,
        };

        // Возвращаем iOS Swipe Back
        if (history.length === 1) {
            bridge.send('VKWebAppEnableSwipeBack');
        }

        // Создаём новую запись в истории браузера
        window.history.pushState(state, panel);

        // Обновляем историю и текущее состояние
        history.push(state);
        setHistory(history);
        setNavState(state);

        console.log(history);
    };
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28SmileOutline from '@vkontakte/icons/dist/28/smile_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28CalendarOutline from '@vkontakte/icons/dist/28/calendar_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

const App = () => {
    const nav = useNav();
    const usersInfo = useUsersInfo();

    // Добавляем обработчик события изменения истории для работы аппаратных кнопок
    useEffect(() => {
        window.addEventListener('popstate', nav.goBack);
    }, []);

    // Загрузка информации о пользователе и о друзьях, к которым есть доступ
    // Сначала идут сведения о текущем пользователе
    useEffect(() => {
        const fetchUsersInfo = async () => {
            if (usersInfo != null) return;

            // Данные о пользователе
            const currentUserInfo = await bridge.send('VKWebAppGetUserInfo');
            let info = [currentUserInfo];

            // ID друзей к которым есть доступ
            const friendsIdsPromise = await api("GET", "/statAccess/", {
                userId: currentUserInfo.id,
            });

            if (friendsIdsPromise.data.length) {
                // Информация о друзьях
                const friendsInfoPromise = await api("GET", "/vk/users/", {
                    user_ids: friendsIdsPromise.data,
                });

                info = info.concat(friendsInfoPromise.data);
            }

            setUsersInfo(info);
        };

        fetchUsersInfo();
    });

    // Упаковываем все функции и передаем во view только нужную ей часть истории
    const nav = {
        history: getLastViewHistory(history),
        panel: navState.panel,
        goBack: goBack,
        goTo: goTo,
    };

    return (
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
                <CheckInStory id="checkIn" nav={nav}/>
                <CheckInStory id="checkIn" nav={nav}/>
                <CalendarStory id="calendar" nav={nav}/>
                <SettingsStory id="settings" nav={nav}/>
            </Epic>
        </ConfigProvider>
    );
};

export default App;

