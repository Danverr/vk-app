import React, {useState, useEffect} from 'react';
import {Epic, Tabbar, TabbarItem, ConfigProvider} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import '@vkontakte/vkui/dist/vkui.css';
import api from "./utils/api";

import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28SmileOutline from '@vkontakte/icons/dist/28/smile_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28CalendarOutline from '@vkontakte/icons/dist/28/calendar_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

import Profiles from './panels/profiles/profiles';
import Feed from "./panels/feed/feed";
import CheckInStory from "./panels/checkIn/checkInStory";
import Calendar from "./panels/calendar/calendar";
import Settings from "./panels/settings/settings";

// Панели по умолчанию для каждого view
const defaultPanels = {
    feed: "main",
    profiles: "main",
    checkIn: "mood",
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

    return viewHistory;
};

const App = () => {
    const [navState, setNavState] = useState({
        story: "checkIn",
        panel: defaultPanels["checkIn"],
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
    };

    // Добавляем обработчик события изменения истории для работы аппаратных кнопок
    useEffect(() => {
        window.addEventListener('popstate', goBack);
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

            if (friendsIdsPromise.data && friendsIdsPromise.data.length) {
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
            <Epic activeStory={navState.story} tabbar={
                <Tabbar>
                    <TabbarItem
                        onClick={() => goTo("feed")}
                        selected={navState.story === "feed"}
                    ><Icon28NewsfeedOutline/></TabbarItem>
                    <TabbarItem
                        onClick={() => goTo("profiles")}
                        selected={navState.story === "profiles"}
                    ><Icon28SmileOutline/></TabbarItem>
                    <TabbarItem
                        onClick={() => goTo("checkIn")}
                        selected={navState.story === "checkIn"}
                    ><Icon28AddCircleOutline/></TabbarItem>
                    <TabbarItem
                        onClick={() => goTo("calendar")}
                        selected={navState.story === "calendar"}
                    ><Icon28CalendarOutline/></TabbarItem>
                    <TabbarItem
                        onClick={() => goTo("settings")}
                        selected={navState.story === "settings"}
                    ><Icon28SettingsOutline/></TabbarItem>
                </Tabbar>
            }>
                <Feed id="feed" nav={nav}/>
                <Profiles id="profiles" nav={nav}/>
                <CheckInStory id="checkIn" nav={nav} usersInfo={usersInfo}/>
                <Calendar id="calendar" nav={nav}/>
                <Settings id="settings" nav={nav}/>
            </Epic>
        </ConfigProvider>
    );
};

export default App;

