import {useEffect, useState} from 'react';
import bridge from "@vkontakte/vk-bridge";
import moment from "moment";

const APP_ID = 7424071;

const getLaunchParams = () => {
    const search = window.location.search.slice(1);
    let params = {};

    for (const pair of search.split("&")) {
        const [key, value] = pair.split("=");
        params[key] = value;
    }

    return params;
};

const launchParams = getLaunchParams();

const sendUserParams = (userInfo) => {
    let userParams = {
        UserID: userInfo.id,
        city: userInfo.city ? userInfo.city.title : "-",
        country: userInfo.country ? userInfo.country.title : "-",
        timezone: userInfo.timezone ? userInfo.timezone : "-",
        sex: "-",
        age: "-",
        ref: launchParams.vk_ref,
        notif: launchParams.vk_are_notifications_enabled,
        fav: launchParams.vk_is_favorite
    };

    if (userInfo.bdate && (userInfo.bdate.match(/\./g) || []).length === 2) {
        userParams.age = moment().diff(moment(userInfo.bdate, "D.M.YYYY"), 'years');
    }

    if (userInfo.sex === 1) userParams.sex = "Female";
    else if (userInfo.sex === 2) userParams.sex = "Male";

    window['yaCounter65896372'].setUserID(`${userInfo.id}`);
    window['yaCounter65896372'].userParams(userParams);
};

const useAppState = () => {
    const [loading, setLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    const [notifications, setNotifications] = useState(launchParams.vk_are_notifications_enabled === '1');
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [entryAdded, setEntryAdded] = useState(false);
    const [updatingEntryData, setUpdatingEntryData] = useState(null);
    const [showIntro, setShowIntro] = useState(launchParams.vk_access_token_settings === "");

    useEffect(() => {
        bridge.subscribe((e) => {
            if (e.detail.type === 'VKWebAppAllowNotificationsResult' && e.detail.data.result)
                setNotifications(true);
            else if (e.detail.type === 'VKWebAppDenyNotificationsResult' && e.detail.data.result)
                setNotifications(false);
        });
    }, []);

    useEffect(() => {
        const showNativeAds = () => {
            bridge.send("VKWebAppShowNativeAds", {ad_format: "preloader"})
                .then((data) => {
                    if (data.result === false) {
                        setTimeout(showNativeAds, 1000);
                    }
                })
                .catch(() => {
                    setTimeout(showNativeAds, 1000);
                });
        };

        if (showIntro === false) {
            showNativeAds();
        }
    }, [showIntro]);

    const fetchUserToken = (callback = null) => {
        bridge.send("VKWebAppGetAuthToken", {
            "app_id": APP_ID,
            "scope": "friends"
        }).then((res) => {
            // Обновляем токен
            if (res.scope === "friends") {
                setUserToken(res.access_token);
                if (callback) callback();
            } else {
                throw new Error("User denied");
            }
        }).catch((error) => {
            if (error.error_data && error.error_data.error_code !== 4) { // 4: User denied
                setGlobalError(error);
            } else {
                setShowIntro(true);
            }
        });
    };

    const fetchUserInfo = () => {
        return bridge.send('VKWebAppGetUserInfo')
            .then((userInfo) => {
                userInfo["isCurrentUser"] = true;
                sendUserParams(userInfo);
                setUserInfo(userInfo);
                return userInfo;
            }).catch((error) => {
                setGlobalError(error);
                throw error;
            });
    };

    useEffect(() => {
        const initApp = async () => {
            const start = moment();

            if (!showIntro) {
                await fetchUserToken();
            }

            await fetchUserInfo();

            const timeout = Math.max(1000 - moment().diff(start), 0);
            setTimeout(() => setLoading(false), timeout);
        };

        initApp();
        // eslint-disable-next-line
    }, []);

    return {
        loading: loading,
        globalError: globalError,
        showIntro: showIntro,
        setShowIntro: setShowIntro,
        notifications: notifications,
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
