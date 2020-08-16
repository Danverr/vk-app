import React, {useState, useEffect} from 'react';
import {Panel, PanelHeader, Group, CardGrid, Spinner, Button} from "@vkontakte/vkui";
import styles from "./chooseProfilePanel.module.css";
import api from "../../../utils/api";
import moment from "moment";

import TextPost from "../../../components/textPost/textPost";
import ErrorPlaceholder from "../../../components/errorPlaceholder/errorPlaceholder";

const fetchFriendsInfo = async () => {
    // ID друзей к которым есть доступ
    const friendsIdsPromise = await api("GET", "/v1.2.0/statAccess/", {
        type: "fromId",
    }).catch((error) => {
        throw error;
    });

    // Информация о друзьях
    const friendsInfoPromise = await api("GET", "/v1.2.0/vkApi/users.get", {
        users: friendsIdsPromise.data.map(item => item.id).join(","),
    }).catch((error) => {
        throw error;
    });

    if (friendsIdsPromise.data.error) throw friendsIdsPromise.data.error;

    return friendsInfoPromise.data.map((info) => {
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
    const {activePanel, userInfo, formatStats, id: panelId} = props;

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
            fetchFriendsInfo().then((friendsInfo) => {
                setUsersInfo([userInfo, ...friendsInfo]);
            }).catch((error) => {
                setError({error: error, reload: fetchData});
            });

            // Загрузка статистики пользователей для карточек
            api("GET", "/v1.2.0/entries/", {
                afterDate: moment().utc().subtract(7, "days").startOf("day").format("YYYY-MM-DD"),
            }).then((res) => {
                let newStats = {};

                for (const post of res.data) {
                    if (newStats[post.userId]) {
                        newStats[post.userId].push(post);
                    } else {
                        newStats[post.userId] = [post];
                    }
                }

                for (const userId in newStats) {
                    newStats[userId] = formatStats(newStats[userId]);
                }

                setStats(newStats);
            }).catch((error) => {
                setError({error: error, reload: fetchData});
            });
        };

        fetchData();
    }, [userInfo, activePanel, formatStats, panelId]);

    // Преобразовываем данные в карточки
    let profileCards = [];
    if (usersInfo) {
        profileCards = usersInfo.map((user) => {
                const post = (stats && stats[user.id]) ? getMeanStats(stats[user.id]) : {
                    mood: null,
                    stress: null,
                    anxiety: null
                };
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

