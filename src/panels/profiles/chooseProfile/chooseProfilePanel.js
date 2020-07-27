import React, {useState, useEffect} from 'react';
import {Panel, PanelHeader, Group, CardGrid, Spinner, Button} from "@vkontakte/vkui";
import styles from "./chooseProfilePanel.module.css";
import api from "../../../utils/api";
import bridge from "@vkontakte/vk-bridge";
import moment from "moment";

import TextPost from "../../../components/textPost/textPost";
import ErrorPlaceholder from "../../../components/errorPlaceholder/errorPlaceholder";

const fetchFriendsInfo = async (userToken) => {
    // ID друзей к которым есть доступ
    const friendsIdsPromise = await api("GET", "/statAccess/", {
        type: "fromId",
    }).catch((error) => {
        throw error;
    });

    // Информация о друзьях
    const friendsInfoPromise = await bridge.send("VKWebAppCallAPIMethod", {
        method: "users.get",
        params: {
            access_token: userToken,
            v: "5.103",
            user_ids: friendsIdsPromise.data.map(item => item.id).join(","),
            fields: "photo_50, photo_100"
        }
    }).catch((error) => {
        throw error;
    });

    return friendsInfoPromise.response.map((info) => {
        return {...info, "isCurrentUser": false};
    });
};

const getMeanStats = (stats) => {
    let mean = [];
    const lastDate = moment().startOf("day").subtract(7, "days");

    for (const key in stats.meanByDays) {
        const filteredStats = stats.meanByDays[key].filter(stat => stat.date.isAfter(lastDate));
        mean[key] = filteredStats.reduce((sum, item) => sum + item.val, 0);
        mean[key] /= Math.max(1, stats.meanByDays[key].length);
    }

    return mean;
};

let localState = {
    usersInfo: null,
    stats: null,
};

const ChooseProfilePanel = (props) => {
    const [error, setError] = useState(null);
    const [usersInfo, setUsersInfo] = useState(localState.usersInfo);
    const [stats, setStats] = useState(localState.stats);
    const {activePanel, userToken, userInfo, formatStats, id: panelId} = props;

    // Обновляем локальный стейт
    useEffect(() => {
        localState = {
            usersInfo: usersInfo,
            stats: stats
        };
    }, [stats, usersInfo]);

    // Загружаем данные о друзьях
    useEffect(() => {
        if (!userInfo || activePanel !== panelId) return;

        const fetchData = () => {
            fetchFriendsInfo(userToken).then((friendsInfo) => {
                setUsersInfo([userInfo, ...friendsInfo]);
            }).catch((error) => {
                setError({error: error, reload: fetchData});
            });

            // Загрузка статистики пользователей для карточек
            api("GET", "/entries/stats/", {
                startDate: moment().utc().subtract(7, "days").startOf("day").format("YYYY-MM-DD"),
            }).then((res) => {
                let newStats = {};

                for (const userId in res.data) {
                    newStats[userId] = formatStats(res.data[userId]);
                }

                setStats(newStats);
            }).catch((error) => {
                setError({error: error, reload: fetchData});
            });
        };

        fetchData();
    }, [userToken, userInfo, activePanel, formatStats, panelId]);

    // Преобразовываем данные в карточки
    let profileCards = [];
    if (usersInfo) {
        profileCards = usersInfo.map((user) => {
                const post = stats ? getMeanStats(stats[user.id]) : {mood: null, stress: null, anxiety: null};
                post.description = "Среднее за последние 7 дней";

                return (
                    <TextPost
                        key={`profileCard_${user.id}`}
                        onClick={() => {
                            props.goToUserProfile();
                            props.setActiveUserProfile(user);
                        }}
                        postData={{user: user, post: post}}
                    />
                );
            }
        );
    }

    let content = <Spinner size="large"/>;

    if (error) {
        content = <ErrorPlaceholder error={error.error} action={<Button onClick={() => {
            setError(null);
            error.reload();
        }}> Попробовать снова </Button>}/>;
    } else if (usersInfo && stats) {
        content = <CardGrid>{profileCards}</CardGrid>
    }

    return (
        <Panel id={panelId}>
            <PanelHeader separator={false}>Профиль</PanelHeader>
            <Group className={styles.cardGroup} separator="hide">
                {content}
            </Group>
        </Panel>
    );
};

export default ChooseProfilePanel;

