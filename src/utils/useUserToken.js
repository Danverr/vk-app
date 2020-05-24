import React, {useState, useEffect} from 'react';
import bridge from "@vkontakte/vk-bridge";

const useUserToken = () => {
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        // Получение токена пользователя
        const fetchUserToken = async () => {
            await bridge.send("VKWebAppGetAuthToken", {
                "app_id": 7424071,
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

        fetchUserToken();
    }, []);

    return userToken;
};

export default useUserToken;