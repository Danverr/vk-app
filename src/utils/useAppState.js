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
    const [banStatus, setBanStatus] = useState(null);
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

    const fetchUserToken = (callback = null) => {
        bridge
            .send("VKWebAppGetAuthToken", {
                app_id: APP_ID,
                scope: "friends",
            })
            .then((res) => {
                // Обновляем токен
                if (res.scope === "friends") {
                    setUserToken(res.access_token);
                    if (callback) callback();
                } else {
                    throw new Error("User denied");
                }
            })
            .catch((error) => {
                if (error.error_data && error.error_data.error_code !== 4) {
                    // 4: User denied
                    setGlobalError(error);
                } else {
                    fetchUserToken();
                }
            });
    };

    const fetchUserInfo = () => {
        return bridge
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

    const fetchBanStatus = () => {
        return api("GET", "/v1.1/banlist/", {}).then((res) => {
            setBanStatus(res.data);
        }).catch((error) => {
            setGlobalError(error);
            throw error;
        });
    };

    useEffect(() => {
        const initApp = async () => {
            const logEvent = (title, status) => {
                let color = "#4bb34b";
                if (status === "Started") color = "#d3b51d";
                else if (status === "Error") color = "#e64646";

                console.log("%s%c%s", `[${moment().diff(start)} ms] ${title}: `, `color: ${color};`, status);
            };

            bridge.subscribe((e) => {
                if (e.detail.type === 'VKWebAppAllowNotificationsResult' && e.detail.data.result)
                    setNotifications(true);
                else if (e.detail.type === 'VKWebAppDenyNotificationsResult' && e.detail.data.result)
                    setNotifications(false);
            });

            const start = moment();
            if (process.env.NODE_ENV === "development") {
                await import("./../eruda");
            }

            console.group("APP INIT");
            logEvent("App Init", "Started");

            // Инициализация VK Mini App
            await bridge.send("VKWebAppInit", {})
                .then(() => logEvent("VK Bridge Init", "Completed"))
                .catch(() => logEvent("VK Bridge Init", "Error"));

            // Загрузка инфы о текущем юзере
            await fetchUserInfo()
                .then(() => logEvent("User Info", "Loaded"))
                .catch(() => logEvent("User Info", "Error"));

            // Загрузка ключей из VK Storage
            await vkStorage.fetchValues()
                .then(() => logEvent("VK Storage Data", "Loaded"))
                .catch(() => logEvent("VK Storage Data", "Error"));

            // Загрузка статуса бана
            await fetchBanStatus()
                .then(() => logEvent("Ban Status", "Loaded"))
                .catch(() => logEvent("Ban Status", "Error"));

            // Инициализация Яндекс.Метрики
            const waitYmInit = () => {
                if (window["yaCounter65896372"] !== undefined) {
                    logEvent("Yandex.Metrika Init", "Completed");
                    const timeout = Math.max(1000 - moment().diff(start), 0);

                    setTimeout(() => {
                        logEvent("App Init", "Completed");
                        console.groupEnd();
                        setLoading(false);
                    }, timeout);
                } else {
                    setTimeout(waitYmInit, 100);
                }
            };

            waitYmInit();
        };

        initApp();
        // eslint-disable-next-line
    }, []);

    return {
        loading: loading,
        banStatus: banStatus,
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
