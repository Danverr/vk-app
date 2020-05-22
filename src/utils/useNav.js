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
    checkIn: "mood",
    calendar: "main",
    settings: "main",
};

const useNav = () => {
    const [isNavbarVis, setNavbarVis] = useState(true);
    const [storyHistory] = useState(["feed"]);
    const [panelHistory] = useState({
        feed: [defaultPanels.feed],
        profiles: [defaultPanels.profiles],
        checkIn: [defaultPanels.checkIn],
        calendar: [defaultPanels.calendar],
        settings: [defaultPanels.settings],
    });

    const getActiveStory = () => storyHistory[storyHistory.length - 1];
    const getActivePanel = () => panelHistory[getActiveStory()][panelHistory[getActiveStory()].length - 1];

    // Функция возврата с экрана
    function goBack() {
        if (panelHistory[getActiveStory()].length > 1) { // Переход между панелями
            panelHistory[getActiveStory()].pop();
        } else { // Переход между историями
            if (storyHistory.length === 1) {
                // Отправляем bridge на закрытие сервиса.
                bridge.send("VKWebAppClose", {"status": "success"});
            } else {
                storyHistory.pop();
            }

            // Убираем iOS Swipe Back
            // Таким образом VKUI свайп не будет конфликтовать со свайпом нативного клиента
            if (storyHistory.length === 1) {
                bridge.send('VKWebAppDisableSwipeBack');
            }
        }

        setNav(getNav());
    }

    // Функция для перехода на другой экран
    function goTo(story, panel = null) {
        // Если переход на ту же историю
        // Если переход на ту же панель внутри истории
        if (getActiveStory() === story && (getActivePanel() === panel || panel === null)) return;

        // Создаём новую запись в истории браузера
        window.history.pushState([story, panel], panel);

        if (panel === null) {
            // Возвращаем iOS Swipe Back
            if (storyHistory.length === 1) {
                bridge.send('VKWebAppEnableSwipeBack');
            }

            // Если история есть в стеке, вынимаем ее
            if (storyHistory.includes(story)) {
                storyHistory.splice(storyHistory.indexOf(story), 1);
            }

            // Добавляем в стек историю
            storyHistory.push(story);
        } else {
            panelHistory[getActiveStory()].push(panel);
        }

        setNav(getNav());
    }

    function clearStoryHistory(story, callback) {
        if (storyHistory.includes(story)) {
            storyHistory.splice(storyHistory.indexOf(story), 1);
        }
        panelHistory[story] = [defaultPanels[story]];

        callback();
        setNav(getNav());
    }

    function getNav() {
        return {
            activeStory: getActiveStory(),
            activePanel: getActivePanel(),
            panelHistory: panelHistory,
            clearStoryHistory: clearStoryHistory,
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
        };
    }

    // Упаковываем все функции
    let [nav, setNav] = useState(getNav());
    useEffect(() => {
        nav.isNavbarVis = isNavbarVis;
    }, [isNavbarVis]);

    console.log(
        "Story history: ", storyHistory,
        "\nCurrent panel history: ", panelHistory[getActiveStory()]
    );
    return getNav();
};

export default useNav;
