import React, { useEffect, useState } from 'react';
import { ScreenSpinner } from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";

import api from "./api";

const APP_ID = 7424071;

function useAppState() {
    const [VKFriendsInfo, setVKFriendsInfo] = useState(null);
    const [userEntries, setUserEntries] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [toEdgesInfo, setToEdgesInfo] = useState(null);
    const [fromEdgesInfo, setFromEdgesInfo] = useState(null);

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

    const fetchVKFriendsInfo = async () => {
        const VKFriendsInfoPromise = await bridge.send("VKWebAppCallAPIMethod", {
            method: "friends.get",
            params: {
                access_token: userToken,
                v: "5.103",
                order: "name",
                fields: "photo_50, photo_100"
            }
        });
        setVKFriendsInfo(VKFriendsInfoPromise.response);
    }

    const fetchToEdgesInfo = async () => {
        // ID друзей к которым есть доступ
        const friendsIdsPromise = await api("GET", "/statAccess/", {
            type: "fromId"
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

        setToEdgesInfo(friendsInfoPromise.response);
    };

    const fetchFromEdgesInfo = async () => {
        // ID друзей к которым есть доступ
        const friendsIdsPromise = await api("GET", "/statAccess/", {
            type: "toId"
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

        setFromEdgesInfo(friendsInfoPromise.response);
    };

    const fetchEntries = async () => {
        const entriesPromise = await api("GET", "/entries/", {
            userId: userInfo.id,
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
        userToken: userToken,
        userInfo: userInfo,
        answer: answer,
        setAnswer: setAnswer,
        entryAdded: entryAdded,
        setEntryAdded: setEntryAdded,

        feed: null,
        profiles: {
            fetchFriendsInfo: fetchToEdgesInfo,
            activeUserProfile: activeUserProfile,
            setActiveUserProfile: setActiveUserProfile,
            usersInfo: (userInfo && toEdgesInfo ? [userInfo, ...toEdgesInfo] : null)
        },
        checkIn: null,
        calendar: null,
        settings: {
            fromEdgesInfo: fromEdgesInfo,
            VKFriendsInfo: VKFriendsInfo,
            fetchFromEdgesInfo: fetchFromEdgesInfo,
            fetchVKFriendsInfo: fetchVKFriendsInfo,
            userToken: userToken,
            userInfo: userInfo
        },
    };
};

export default useAppState;
