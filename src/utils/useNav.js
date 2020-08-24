import React, {useState, useEffect} from "react";
import bridge from "@vkontakte/vk-bridge";
import {Tabbar, TabbarItem} from "@vkontakte/vkui";

import Icon28NewsfeedOutline from "@vkontakte/icons/dist/28/newsfeed_outline";
import Icon28Profile from "@vkontakte/icons/dist/28/profile";
import Icon28AddCircleOutline from "@vkontakte/icons/dist/28/add_circle_outline";
import Icon28CalendarOutline from "@vkontakte/icons/dist/28/calendar_outline";
import Icon28SettingsOutline from "@vkontakte/icons/dist/28/settings_outline";

const defaultStory = "feed";

// Панели по умолчанию для каждого view
const defaultPanels = {
    banned: "main",
    intro: 0,

    feed: "main",
    profiles: "chooseProfile",
    checkIn: "main",
    calendar: "main",
    settings: "main",
};

const getDefaultPanelHistory = () => {
    const panelHistory = {};

    for (let key in defaultPanels) {
        panelHistory[key] = [defaultPanels[key]];
    }

    return panelHistory;
};

const useNav = () => {
    let [scrollHistory] = useState({});
    let [isNavbarVis] = useState(true);
    let [popout] = useState(null);
    const [viewHistory] = useState([defaultStory]);
    const [panelHistory] = useState(getDefaultPanelHistory());

    const getActiveStory = () => viewHistory[viewHistory.length - 1];
    const getActivePanel = () => panelHistory[getActiveStory()][panelHistory[getActiveStory()].length - 1];

    const sendHit = () =>
        window["yaCounter65896372"].hit(
            "https://vk.com/app7424071/" + getActiveStory() + "/" + getActivePanel()
        );

    const getCurrentPath = () => `${getActiveStory()}__${getActivePanel()}`;
    const saveScroll = () =>
        (scrollHistory[getCurrentPath()] = document.scrollingElement.scrollTop);
    const setSavedScroll = () => {
        const name = getCurrentPath();
        const scrollTop = name in scrollHistory ? scrollHistory[name] : 0;
        document.scrollingElement.scrollTop = Math.min(
            scrollTop,
            document.scrollingElement.scrollHeight
        );
    };

    const setScroll = (val) => {
        document.scrollingElement.scrollTop = Math.min(val, document.scrollingElement.scrollHeight);
    };

    useEffect(() => {
        setSavedScroll();
    });

    const setPopout = (newPopout) => {
        // Создаём новую запись в истории браузера
        window.history.pushState([getActiveStory(), getActivePanel()], popout);
        saveScroll();
        popout = newPopout;
        setNav(getNav());
    };

    // Функция возврата с экрана
    const goBack = () => {
        // Сохраняем позицию скролла перед уходом
        saveScroll();

        if (popout) { // Убираем popout
            popout = null;
        } else if (panelHistory[getActiveStory()].length > 1) { // Переход между панелями
            saveScroll();
            panelHistory[getActiveStory()].pop();
        } else { // Переход между историями
            if (viewHistory.length === 1) {
                // Отправляем bridge на закрытие сервиса.
                bridge.send("VKWebAppClose", {status: "success"});
            } else {
                viewHistory.pop();
            }

            // Убираем iOS Swipe Back
            // Таким образом VKUI свайп не будет конфликтовать со свайпом нативного клиента
            if (viewHistory.length === 1) {
                bridge.send("VKWebAppDisableSwipeBack");
            }
        }

        sendHit();
        setNav(getNav());
    };

    // Функция для перехода на другой экран
    const goTo = (story, panel = null) => {
        // Если переход на ту же историю
        // Если переход на ту же панель внутри истории
        if (getActiveStory() === story && (getActivePanel() === panel || panel === null)) return;

        // Сохраняем позицию скролла перед уходом
        saveScroll();

        // При уходе убираем popout
        if (popout) {
            popout = null;
        }

        if (panel === null) {
            // Возвращаем iOS Swipe Back
            if (viewHistory.length === 1) {
                bridge.send("VKWebAppEnableSwipeBack");
            }

            // Если история есть в стеке, вынимаем ее
            if (viewHistory.includes(story)) {
                viewHistory.splice(viewHistory.indexOf(story), 1);
            } else {
                // Создаём новую запись в истории браузера
                window.history.pushState([story, panel], panel);
            }

            // Добавляем в стек историю
            viewHistory.push(story);
        } else {
            // Создаём новую запись в истории браузера
            window.history.pushState([story, panel], panel);

            panelHistory[getActiveStory()].push(panel);
        }

        sendHit();
        setNav(getNav());
    };

    const clearStory = (story, callback = null) => {
        if (viewHistory.includes(story)) {
            viewHistory.splice(viewHistory.indexOf(story), 1);
        }

        panelHistory[story] = [defaultPanels[story]];

        if (callback) callback();
        setNav(getNav());
    };

    const setNavbarVis = (vis) => {
        isNavbarVis = vis;
        setNav(getNav());
    };

    const getNav = () => ({
        saveScroll: saveScroll,
        setScroll: setScroll,
        activeStory: getActiveStory(),
        activePanel: getActivePanel(),
        viewHistory: viewHistory,
        panelHistory: panelHistory,
        clearStory: clearStory,
        popout: popout,
        setPopout: setPopout,
        goBack: goBack,
        goTo: goTo,
        setNavbarVis: setNavbarVis,
        scrollHistory: scrollHistory,
        navbar: isNavbarVis ? (
            <Tabbar>
                <TabbarItem onClick={() => goTo("feed")} selected={getActiveStory() === "feed"}>
                    <Icon28NewsfeedOutline/>
                </TabbarItem>
                <TabbarItem
                    onClick={() => goTo("profiles")}
                    selected={getActiveStory() === "profiles"}
                >
                    <Icon28Profile/>
                </TabbarItem>
                <TabbarItem
                    onClick={() => goTo("checkIn")}
                    selected={getActiveStory() === "checkIn"}
                >
                    <Icon28AddCircleOutline/>
                </TabbarItem>
                <TabbarItem
                    onClick={() => goTo("calendar")}
                    selected={getActiveStory() === "calendar"}
                >
                    <Icon28CalendarOutline/>
                </TabbarItem>
                <TabbarItem
                    onClick={() => goTo("settings")}
                    selected={getActiveStory() === "settings"}
                >
                    <Icon28SettingsOutline/>
                </TabbarItem>
            </Tabbar>
        ) : null,
    });

    // Упаковываем все функции
    let [nav, setNav] = useState(getNav());

    return nav;
};

export default useNav;
