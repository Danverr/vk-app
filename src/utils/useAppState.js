import {useEffect, useState} from 'react';
import bridge from "@vkontakte/vk-bridge";

const APP_ID = 7424071;

const useAppState = () => {
    const [loading, setLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [entryAdded, setEntryAdded] = useState(false);
    const [updatingEntryData, setUpdatingEntryData] = useState(null);
    const showIntro = localStorage.showIntro === "true" || localStorage.showIntro === undefined;

    const fetchUserToken = (callback = null) => {
        return bridge.send("VKWebAppGetAuthToken", {
            "app_id": APP_ID,
            "scope": "friends"
        }).then((res) => {
            // Обновляем токен
            if (res.scope === "friends") {
                setUserToken(res.access_token);
                if (callback) callback();
                return res.access_token;
            }
        }).catch((error) => {
            if (error.error_data.error_code !== 4) { // 4: User denied
                setGlobalError(error);
                throw error;
            }
        });
    };

    const fetchUserInfo = () => {
        return bridge.send('VKWebAppGetUserInfo')
            .then((userInfo) => {
                userInfo["isCurrentUser"] = true;
                setUserInfo(userInfo);
                return userInfo;
            }).catch((error) => {
                setGlobalError(error);
                throw error;
            });
    };

    useEffect(() => {
        const initApp = async () => {
            if (!showIntro) await fetchUserToken();
            await fetchUserInfo();
            setLoading(false);
        };

        initApp();
    }, [showIntro]);

    return {
        loading: loading,
        globalError: globalError,
        showIntro: showIntro,
        userToken: userToken,
        fetchUserToken: fetchUserToken,
        userInfo: userInfo,
        updatingEntryData: updatingEntryData,
        setUpdatingEntryData: setUpdatingEntryData,
        entryAdded: entryAdded,
        setEntryAdded: setEntryAdded
    };
};

export default useAppState;