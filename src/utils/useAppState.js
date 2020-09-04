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
    const [notifications, setNotifications] = useState(
        launchParams.vk_are_notifications_enabled === "1"
    );
    const [isBanned, setIsBanned] = useState(null);
    const [globalError, setGlobalError] = useState(null);
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
        if (!loading && !vkStorage.getValue("showIntro")) {
            bridge.send("VKWebAppShowNativeAds", {ad_format: "preloader"})
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
                    throw error;
                }
            });
    };

    const fetchUserInfo = async () => {
        bridge
            .send("VKWebAppGetUserInfo")
            .then((userInfo) => {
                entryWrapper.userInfo = userInfo;
                userInfo["isCurrentUser"] = true;
                setUserInfo(userInfo);
                return userInfo;
            })
            .catch((error) => {
                throw error;
            });
    };

    const fetchIsBanned = () => {
        return api("GET", "/v1.2.0/users/", {}).then((res) => {
            setIsBanned(res.data.isBanned);
        }).catch((error) => {
            throw error;
        });
    };

    const ymInit = async () => {
        if (window["yaCounter65896372"] === undefined) {
            setTimeout(await ymInit, 100);
        }
    };

    const initScheme = async () => {
        return bridge.send('VKWebAppSetViewSettings', {
            'status_bar_style': 'dark',
            'action_bar_color': '#fff'
        }).catch((error) => {
            error.message = error.error_data.error_reason;
            throw error;
        });
    };

    const [initActions] = useState([
        {name: "User Info Loading", func: fetchUserInfo},
        {name: "VK Storage Loading", func: vkStorage.fetchValues},
        {name: "Ban Status Loading", func: fetchIsBanned},
        {name: "Init Color Scheme", func: initScheme},
        {name: "Yandex.Metrika Init", func: ymInit},
    ]);
    let [initActionsCompleted] = useState(0);

    const initApp = async () => {
        const logEvent = (title, status) => {
            let color = "#e64646";

            if (status === "Started") {
                color = "#d3b51d";
            } else if (status === "OK" || status === "Completed" || status === "Already Completed") {
                color = "#4bb34b";
            }

            console.log("%s%c%s", `[${moment().diff(start)} ms] ${title}: `, `color: ${color};`, status);
        };

        const runAction = async (action) => {
            const params = action.params ? action.params : [];

            await action.func(...params)
                .then(() => logEvent(action.name, "OK"))
                .catch(error => logEvent(action.name, error.message))
                .finally(() => {
                    action.completed = true;

                    if (++initActionsCompleted === initActions.length) {
                        logEvent("App Init", "Completed");
                        console.groupEnd();
                        setLoading(false);
                    }
                });
        };

        const start = moment();

        // Если через 10 секунд не загрузились - выбрасываем ошибку
        setTimeout(() => {
            if (initActionsCompleted !== initActions.length) {
                setGlobalError(Error("Network Error"));
            }
        }, 10 * 1000);

        if (process.env.NODE_ENV === "development") {
            await import("./../eruda");
        }

        console.group(`APP INIT (${process.env.REACT_APP_VERSION} ${process.env.NODE_ENV})`);

        if (initActionsCompleted === initActions.length) {
            logEvent("App Init", "Already Completed");
            console.groupEnd();
            return;
        } else {
            logEvent("App Init", "Started");
        }

        for (const action of initActions) {
            if (action.completed) {
                logEvent(action.name, "Already Completed");
                continue;
            }

            logEvent(action.name, "Started");

            if (action.await) await runAction(action);
            else runAction(action);
        }
    };

    useEffect(() => {
        bridge.subscribe((e) => {
            const {type, data} = e.detail;
            if (type === undefined) return;
            console.log("%c%s:", `font-weight: bold;`, type, data);

            if (type === 'VKWebAppAllowNotificationsResult' && data.result) {
                setNotifications(true);
            } else if (type === 'VKWebAppDenyNotificationsResult' && data.result) {
                setNotifications(false);
            } else if (type === "VKWebAppViewRestore" || (type === "VKWebAppInitResult" && data.result)) {
                initApp();
            }
        });

        bridge.send("VKWebAppInit");
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (globalError !== null) {
            throw globalError;
        }
    }, [globalError]);

    return {
        initApp: initApp,
        loading: loading,
        isBanned: isBanned,
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
