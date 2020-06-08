import React, {useEffect, useState} from 'react';
import {ScreenSpinner} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import api from "./api";
import DeleteBar from '../panels/feed/components/DeleteBar/DeleteBar';

const APP_ID = 7424071;

function useAppState() {
    const [userEntries, setUserEntries] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [friendsInfo, setFriendsInfo] = useState(null);
    const [rootPopup, setRootPopup] = useState(<ScreenSpinner />);

    const [allEntries, setAllEntries] = useState(null);

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
        if (!userInfo || !userToken) return;

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

    const fetchEntries = async () => {
        if (!userInfo) return;

        const entriesPromise = await api("GET", "/entries/", {
            userId: userInfo.id,
        });

        setUserEntries(entriesPromise.data);
    };

    const fetchAllEntries = async () => {
        if (!userInfo || !userToken || !friendsInfo) return;

        const fetchUsersEntries = async (promises) => {
            const result = await Promise.all(promises);
            setAllEntries(result);
        };

        const allUsers = [userInfo, ...friendsInfo];
        const postsPromises = [];
        allUsers.map((user, i) => {
            postsPromises.push(api("GET", "/entries/", { userId: user.id }));
        })

        fetchUsersEntries(postsPromises);
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

        feed: {
            fetchFriendsInfo: fetchFriendsInfo,
            userInfo: userInfo,
            userToken: userToken,
            fetchEntries: fetchAllEntries,
            entries: allEntries,
            friendsInfo: friendsInfo,
            usersInfo: (userInfo && friendsInfo ? [userInfo, ...friendsInfo] : null)
        },
        profiles: {
            fetchFriendsInfo: fetchFriendsInfo,
            activeUserProfile: activeUserProfile,
            setActiveUserProfile: setActiveUserProfile,
            usersInfo: (userInfo && friendsInfo ? [userInfo, ...friendsInfo] : null)
        },
        checkIn: null,
        calendar: null,
        settings: null,
    };
}

export default useAppState;