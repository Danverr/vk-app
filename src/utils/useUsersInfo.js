import React, {useState, useEffect} from 'react';
import bridge from "@vkontakte/vk-bridge";
import api from "./api";

const useUsersInfo = (userToken) => {
    let [usersInfo, setUsersInfo] = useState(null);

    // Загрузка информации о пользователе и о друзьях, к которым есть доступ
    // Сначала идут сведения о текущем пользователе
    useEffect(() => {
        if (usersInfo || !userToken) return;

        const fetchUsersInfo = async () => {
            // Данные о пользователе
            const currentUserInfo = await bridge.send('VKWebAppGetUserInfo');

            // ID друзей к которым есть доступ
            const friendsIdsPromise = await api("GET", "/statAccess/", {
                toId: currentUserInfo.id,
            });

            // Удаляем id текущего юзера
            friendsIdsPromise.data.splice(friendsIdsPromise.data.indexOf(currentUserInfo.id, 0), 1);

            console.log(friendsIdsPromise.data);

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

            setUsersInfo([currentUserInfo, ...friendsInfoPromise.response]);
        };

        fetchUsersInfo();
    });

    return usersInfo;
};

export default useUsersInfo;