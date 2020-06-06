import React, {useState, useEffect} from 'react';
import bridge from "@vkontakte/vk-bridge";
import {Tabbar, TabbarItem} from "@vkontakte/vkui";

import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28SmileOutline from '@vkontakte/icons/dist/28/smile_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28CalendarOutline from '@vkontakte/icons/dist/28/calendar_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

// Панели по умолчанию для каждого view
const defaultPanels = {
    feed: "main",
    profiles: "main",
    checkIn: "main",
    calendar: "main",
    settings: "main",
};

const useNav = () => {
    let [isNavbarVis] = useState(true);
    const [viewHistory] = useState(["feed"]);
    const [panelHistory] = useState({
        feed: [defaultPanels.feed],
        profiles: [defaultPanels.profiles],
        checkIn: [defaultPanels.checkIn],
        calendar: [defaultPanels.calendar],
        settings: [defaultPanels.settings],
    });

    const getActiveStory = () => viewHistory[viewHistory.length - 1];
    const getActivePanel = () => panelHistory[getActiveStory()][panelHistory[getActiveStory()].length - 1];

    // Функция возврата с экрана
    const goBack = () => {
        if (panelHistory[getActiveStory()].length > 1) { // Переход между панелями
            panelHistory[getActiveStory()].pop();
        } else { // Переход между историями
            if (viewHistory.length === 1) {
                // Отправляем bridge на закрытие сервиса.
                bridge.send("VKWebAppClose", {"status": "success"});
            } else {
                viewHistory.pop();
            }

            // Убираем iOS Swipe Back
            // Таким образом VKUI свайп не будет конфликтовать со свайпом нативного клиента
            if (viewHistory.length === 1) {
                bridge.send('VKWebAppDisableSwipeBack');
            }
        }

        setNav(getNav());
    };

    // Функция для перехода на другой экран
    const goTo = (story, panel = null) => {
        // Если переход на ту же историю
        // Если переход на ту же панель внутри истории
        if (getActiveStory() === story && (getActivePanel() === panel || panel === null)) return;

        if (panel === null) {
            // Возвращаем iOS Swipe Back
            if (viewHistory.length === 1) {
                bridge.send('VKWebAppEnableSwipeBack');
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

        setNav(getNav());
    };

    const clearStory = (story, callback) => {
        if (viewHistory.includes(story)) {
            viewHistory.splice(viewHistory.indexOf(story), 1);
        }
        panelHistory[story] = [defaultPanels[story]];

        callback();
        setNav(getNav());
    };

    const setNavbarVis = (vis) => {
        isNavbarVis = vis;
        setNav(getNav());
    };

    const getNav = () => ({
        activeStory: getActiveStory(),
        activePanel: getActivePanel(),
        panelHistory: panelHistory,
        clearStory: clearStory,
        goBack: goBack,
        goTo: goTo,
        setNavbarVis: setNavbarVis,
        navbar: isNavbarVis ? (<Tabbar>
            <TabbarItem
                onClick={() => goTo("feed")}
                selected={getActiveStory() === "feed"}
            ><Icon28NewsfeedOutline/></TabbarItem>
            <TabbarItem
                onClick={() => goTo("profiles")}
                selected={getActiveStory() === "profiles"}
            ><Icon28SmileOutline/></TabbarItem>
            <TabbarItem
                onClick={() => goTo("checkIn")}
                selected={getActiveStory() === "checkIn"}
            ><Icon28AddCircleOutline/></TabbarItem>
            <TabbarItem
                onClick={() => goTo("calendar")}
                selected={getActiveStory() === "calendar"}
            ><Icon28CalendarOutline/></TabbarItem>
            <TabbarItem
                onClick={() => goTo("settings")}
                selected={getActiveStory() === "settings"}
            ><Icon28SettingsOutline/></TabbarItem>
        </Tabbar>) : null,
    });

    // Упаковываем все функции
    let [nav, setNav] = useState(getNav());

    console.log(
        "View history: ", viewHistory,
        "\nCurrent panel history: ", panelHistory[getActiveStory()]
    );
    return nav;
};

export default useNav;
