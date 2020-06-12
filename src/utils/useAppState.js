import React, {useEffect, useState} from 'react';
import {ScreenSpinner} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import api from "./api";

const APP_ID = 7424071;

const useAppState = () => {
    const [userEntries, setUserEntries] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [friendsInfo, setFriendsInfo] = useState(null);
    const [rootPopup, setRootPopup] = useState(<ScreenSpinner/>);

    const now = () => {
        if (!userInfo) return null;

        const date = new Date();
        date.setHours(date.getUTCHours() + userInfo.timezone);

        return date;
    };

    const fetchUserToken = () => {
        bridge.send("VKWebAppGetAuthToken", {
            "app_id": APP_ID,
            "scope": "friends"
        }).then((res) => {
            if (res.scope !== "friends") {
                // Отправляем bridge на закрытие сервиса если токен не получен
                bridge.send("VKWebAppClose", {"status": "success"});
            } else {
                // Обновляем токен
                setUserToken(res.access_token);
            }
        }).catch((error) => {
            // Отправляем bridge на закрытие сервиса если токен не получен
            bridge.send("VKWebAppClose", {"status": "success"});
        });
    };

    const fetchUserInfo = async (userToken) => {
        // Данные о пользователе
        let userInfo = await bridge.send('VKWebAppGetUserInfo');
        userInfo["isCurrentUser"] = true;
        setUserInfo(userInfo);
    };

    const fetchFriendsInfo = async () => {
        // ID друзей к которым есть доступ
        const friendsIdsPromise = await api("GET", "/statAccess/", {
            toId: userInfo.id,
        });

        // Информация о друзьях
        const friendsInfoPromise = await bridge.send("VKWebAppCallAPIMethod", {
            method: "users.get",
            params: {
                access_token: userToken,
                v: "5.103",
                user_ids: friendsIdsPromise.data.join(","),
                fields: "photo_50, photo_100"
            }
        });

        friendsInfoPromise.response.map((info) => {
            return {...info, "isCurrentUser": false};
        });

        setFriendsInfo(friendsInfoPromise.response);
    };

    const fetchEntries = async (timezone) => {
        const entriesPromise = await api("GET", "/entries/", {
            userId: userInfo.id,
        });

        entriesPromise.data.map((entry) => {
            entry.date = new Date(entry.date);
            entry.date.setHours(entry.date.getHours() + timezone);
        });

        setUserEntries(entriesPromise.data);
    };

    useEffect(() => {
        const initAppState = async () => {
            await fetchUserToken();
            await fetchUserInfo();

            setRootPopup(null);
        };

        initAppState();
    }, []);

    // Profiles
    const [activeUserProfile, setActiveUserProfile] = useState(null);

    return {
        rootPopup: rootPopup,

        feed: null,
        profiles: {
            fetchFriendsInfo: fetchFriendsInfo,
            activeUserProfile: activeUserProfile,
            setActiveUserProfile: setActiveUserProfile,
            now: now,
            timezone: (userInfo ? userInfo.timezone : null),
            usersInfo: (userInfo && friendsInfo ? [userInfo, ...friendsInfo] : null)
        },
        checkIn: null,
        calendar: null,
        settings: null,
    };
}

export default useAppState;