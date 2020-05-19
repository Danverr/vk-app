import React, {useState} from 'react';
import bridge from "@vkontakte/vk-bridge";

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

    viewHistory.reverse();
    return viewHistory;
};

const useNav = () => {
    const [history] = useState([{
        story: "checkIn",
        panel: defaultPanels["checkIn"],
    }]);

    // Функция возврата с экрана
    const goBack = () => {
        if (history.length === 1) {
            // Отправляем bridge на закрытие сервиса.
            bridge.send("VKWebAppClose", {"status": "success"});
        } else {
            // Обновляем историю и текущее состояние
            history.pop();
            setNav(getNav());
        }

        // Убираем iOS Swipe Back
        // Таким образом VKUI свайп не будет конфликтовать со свайпом нативного клиента
        if (history.length === 1) {
            bridge.send('VKWebAppDisableSwipeBack');
        }
    };

    // Функция для перехода на другой экран
    const goTo = (story, panel = null) => {
        if (history[history.length - 1].story === story && history[history.length - 1].panel === panel) return;

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
        setNav(getNav());
    };

    const getNav = () => {
        return {
            activeStory: history[history.length - 1].story,
            activePanel: history[history.length - 1].panel,
            viewHistory: getLastViewHistory(history),
            goBack: goBack,
            goTo: goTo,
        };
    };

    // Упаковываем все функции и передаем во view только нужную ей часть истории
    const [nav, setNav] = useState(getNav());
    return nav;
};

export default useNav;