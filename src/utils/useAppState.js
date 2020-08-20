import {useEffect, useState} from "react";
import bridge from "@vkontakte/vk-bridge";
import moment from "moment";
import entryWrapper from "../components/entryWrapper";
import useVkStorage from "./useVkStorage";
import api from './api';

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

const useAppState = () => {
    const [loading, setLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    const [notifications, setNotifications] = useState(
        launchParams.vk_are_notifications_enabled === "1"
    );
    const [isBanned, setIsBanned] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [entryAdded, setEntryAdded] = useState(false);
    const [updatingEntryData, setUpdatingEntryData] = useState(null);
    const vkStorage = useVkStorage({
        showIntro: true,
        showEntryNotifTooltip: true,
        showHealthNotifTooltip: true,
        showAccessNotifTooltip: true,
    });

    useEffect(() => {
        const showNativeAds = () => {
            bridge
                .send("VKWebAppShowNativeAds", {ad_format: "preloader"})
                .then((data) => {
                    if (data.result === false) {
                        setTimeout(showNativeAds, 1000);
                    }
                })
                .catch(() => {
                    setTimeout(showNativeAds, 1000);
                });
        };

        if (!loading && !vkStorage.getValue("showIntro")) {
            showNativeAds();
        }

        // eslint-disable-next-line
    }, [loading]);

    const fetchUserToken = async (callback = null) => {
        await bridge
            .send("VKWebAppGetAuthToken", {
                app_id: APP_ID,
                scope: "friends",
            })
            .then((res) => {
                // Обновляем токен
                if (res.scope === "friends") {
                    entryWrapper.userToken = res.access_token;
                    setUserToken(res.access_token);
                    if (callback) callback();
                } else {
                    throw new Error("User denied");
                }
            })
            .catch((error) => {
                if (error.error_data && error.error_data.error_code !== 4) { // 4: User denied
                    setGlobalError(error);
                }
            });
    };

    const fetchUserInfo = async () => {
        await bridge
            .send("VKWebAppGetUserInfo")
            .then((userInfo) => {
                entryWrapper.userInfo = userInfo;
                userInfo["isCurrentUser"] = true;
                setUserInfo(userInfo);
                return userInfo;
            })
            .catch((error) => {
                setGlobalError(error);
                throw error;
            });
    };

    const fetchIsBanned = () => {
        return api("GET", "/v1.2.0/users/", {}).then((res) => {
            setIsBanned(res.data.isBanned);
        }).catch((error) => {
            setGlobalError(error);
            throw error;
        });
    };

    const ymInit = async () => {
        if (window["yaCounter65896372"] === undefined) {
            setTimeout(await ymInit, 100);
        }
    };

    const vkSubscribe = async () => {
        await bridge.subscribe((e) => {
            if (e.detail.type === 'VKWebAppAllowNotificationsResult' && e.detail.data.result) {
                setNotifications(true);
            } else if (e.detail.type === 'VKWebAppDenyNotificationsResult' && e.detail.data.result) {
                setNotifications(false);
            } else if (e.detail.type === "VKWebAppViewRestore") {
                initApp();
            }
        });
    };

    const [initActions] = useState([
        {name: "VK Subscribe", func: vkSubscribe},
        {name: "VK Bridge Init", func: bridge.send, params: ["VKWebAppInit", {}], await: true},
        {name: "VK Storage Loading", func: vkStorage.fetchValues},
        {name: "Yandex.Metrika Init", func: ymInit},
        {name: "User Info Loading", func: fetchUserInfo, await: true},
        {name: "Ban Status Loading", func: fetchIsBanned},
    ]);
    let [initActionsCompleted] = useState(0);

    const initApp = async () => {
        if (initActionsCompleted === initActions.length) {
            return;
        }

        const logEvent = (title, status) => {
            let color = "#e64646";
            if (status === "Started") color = "#d3b51d";
            else if (status === "OK" || status === "Completed") color = "#4bb34b";

            console.log("%s%c%s", `[${moment().diff(start)} ms] ${title}: `, `color: ${color};`, status);
        };

        const runAction = async (action) => {
            const params = action.params ? action.params : [];

            await action.func(...params)
                .then(() => logEvent(action.name, "OK"))
                .catch(error => logEvent(action.name, error.message))
                .finally(() => {
                    if (++initActionsCompleted === initActions.length) {
                        endAppInit();
                    }
                });
        };

        const endAppInit = () => {
            const timeout = Math.max(1000 - moment().diff(start), 0);

            setTimeout(() => {
                logEvent("App Init", "Completed");
                console.groupEnd();
                setLoading(false);
            }, timeout);
        };

        const start = moment();

        //if (process.env.NODE_ENV === "development") {
        await import("./../eruda");
        //}

        console.group("APP INIT");
        logEvent("App Init", "Started");

        for (const action of initActions) {
            logEvent(action.name, "Started");

            if (action.await) await runAction(action);
            else runAction(action);
        }
    };

    useEffect(() => {
        initApp();
        // eslint-disable-next-line
    }, []);

    return {
        initApp: initApp,
        loading: loading,
        isBanned: isBanned,
        globalError: globalError,
        vkStorage: vkStorage,
        notifications: notifications,
        accessTokenScope: launchParams.vk_access_token_settings,
        userToken: userToken,
        fetchUserToken: fetchUserToken,
        userInfo: userInfo,
        updatingEntryData: updatingEntryData,
        setUpdatingEntryData: setUpdatingEntryData,
        entryAdded: entryAdded,
        setEntryAdded: setEntryAdded,
    };
};

export default useAppState;
