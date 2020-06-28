import React, { useEffect, useState } from 'react';
import { ScreenSpinner } from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";

const APP_ID = 7424071;

const useAppState = () => {
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [rootPopup, setRootPopup] = useState(<ScreenSpinner/>);
    const [entryAdded, setEntryAdded] = useState(false);
    const [answer, setAnswer] = useState({
        mood: {val: null, index: null},
        stress: {val: null, index: null},
        anxiety: {val: null, index: null},
        title: {val: "", index: null},
        note: {val: "", index: null},
        date: {val: null, index: null},
        isPublic: {val: 0, index: null},
    });

    const fetchUserToken = () => {
        bridge.send("VKWebAppGetAuthToken", {
            "app_id": APP_ID,
            "scope": "friends"
        }).then((res) => {
            if (res.scope !== "friends") {
                // Отправляем bridge на закрытие сервиса если токен не получен
                bridge.send("VKWebAppClose", { "status": "success" });
            } else {
                // Обновляем токен
                setUserToken(res.access_token);
            }
        }).catch((error) => {
            // Отправляем bridge на закрытие сервиса если токен не получен
            bridge.send("VKWebAppClose", { "status": "success" });
        });
    };

    const fetchUserInfo = async (userToken) => {
        // Данные о пользователе
        let userInfo = await bridge.send('VKWebAppGetUserInfo');
        userInfo["isCurrentUser"] = true;
        setUserInfo(userInfo);
    };

    useEffect(() => {
        const initAppState = async () => {
            await fetchUserToken();
            await fetchUserInfo();

            setRootPopup(null);
        };

        initAppState();
    }, []);

    return {
        rootPopup: rootPopup,
        userToken: userToken,
        userInfo: userInfo,
        answer: answer,
        setAnswer: setAnswer,
        entryAdded: entryAdded,
        setEntryAdded: setEntryAdded
    };
};

export default useAppState;
