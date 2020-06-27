import React, {useEffect, useState} from 'react';
import {ScreenSpinner} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import api from "./api";
import { getDateDescription } from './chrono.js'

const APP_ID = 7424071;

function useAppState() {
    const [userEntries, setUserEntries] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [friendsInfo, setFriendsInfo] = useState(null);
    const [rootPopup, setRootPopup] = useState(<ScreenSpinner />);

    const [entriesPromises, setEntriesPromises] = useState(null);
    const [allUsersEntries, setAllUsersEntries] = useState(null);

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

    const deleteEntry = (id) => {
        return api("DELETE", "/entries/", { entryId: id });
    };

    const createEntry = (post) => {
        return api("POST", "/entries/", {
            entries: JSON.stringify(
                [post]),
        });
    }

    const fetchFriendsInfo = async () => {
        if (!userInfo || !userToken) return;

        // ID друзей к которым есть доступ
        const friendsIdsPromise = await api("GET", "/statAccess/", {
            type: 'fromId'
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

    const fetchAllEntries = () => {
        if (!userInfo || !userToken || !friendsInfo) return;
        // загружаем промисы записей

        const ids = [];
        ids.push(userInfo.id);
        friendsInfo.map((friend) => { ids.push(friend.id); });

        const postsPromises = api("GET", "/entries/all", { skip: 0, count:100} );
        postsPromises.then((result) => {
            setEntriesPromises(result.data);
        })
    };

    useEffect(() => {
        if (!entriesPromises || !userInfo) return;
        // промисы загрузились

        const usersMap = {};
        usersMap[userInfo.id] = userInfo;
        friendsInfo.map((friend) => { usersMap[friend.id] = friend; });

        const newPosts = [];
        const now = new Date();

        entriesPromises.map((post, i) => {
            const postDate = new Date(post.date);
            postDate.setHours(postDate.getHours() + userInfo.timezone);
            post.dateField = getDateDescription(postDate, now);
            const obj = {
                user: usersMap[post.userId],
                post: post,
                currentUser: userInfo,
            }
            newPosts.push(obj);
        });
        setAllUsersEntries(newPosts);
    }, [entriesPromises]);

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
            createEntry: createEntry,
            deleteEntry: deleteEntry,
            fetchFriendsInfo: fetchFriendsInfo,
            userInfo: userInfo,
            userToken: userToken,
            fetchEntries: fetchAllEntries,
            entries: allUsersEntries,
            friendsInfo: friendsInfo,
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