import React, {useState, useEffect} from 'react';
import bridge from "@vkontakte/vk-bridge";
import api from "./api";

const useUsersInfo = () => {
    let [usersInfo, setUsersInfo] = useState(null);

    // Загрузка информации о пользователе и о друзьях, к которым есть доступ
    // Сначала идут сведения о текущем пользователе
    useEffect(() => {
        const fetchUsersInfo = async () => {
            if (usersInfo != null) return;

            // Данные о пользователе
            const currentUserInfo = await bridge.send('VKWebAppGetUserInfo');
            let info = [currentUserInfo];

            // ID друзей к которым есть доступ
            const friendsIdsPromise = await api("GET", "/statAccess/", {
                userId: currentUserInfo.id,
            });

            if (friendsIdsPromise.data && friendsIdsPromise.data.length) {
                // Информация о друзьях
                const friendsInfoPromise = await api("GET", "/vk/users/", {
                    user_ids: friendsIdsPromise.data,
                });

                info = info.concat(friendsInfoPromise.data);
            }

            setUsersInfo(info);
        };

        fetchUsersInfo();
    });

    return usersInfo;
};

export default useUsersInfo;