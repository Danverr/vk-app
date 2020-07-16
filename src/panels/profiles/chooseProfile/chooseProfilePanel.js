import React, {useState, useEffect} from 'react';
import {Panel, PanelHeader, Group, CardGrid, Spinner} from "@vkontakte/vkui";
import styles from "./chooseProfilePanel.module.css";
import api from "../../../utils/api";
import bridge from "@vkontakte/vk-bridge";
import moment from "moment";

import ProfileCard from "./profileCard/profileCard";
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
            user_ids: friendsIdsPromise.data.join(","),
            fields: "photo_50, photo_100"
        }
    }).catch((error) => {
        throw error;
    });

    return friendsInfoPromise.response.map((info) => {
        return {...info, "isCurrentUser": false};
    });
};

const defaultStats = {
    mood: [],
    stress: [],
    anxiety: [],
};

let localState = {
    usersInfo: null,
    stats: null,
};

const ChooseProfilePanel = (props) => {
    const [error, setError] = useState(null);
    const [usersInfo, setUsersInfo] = useState(localState.usersInfo);
    const [stats, setStats] = useState(localState.stats);
    const {userToken, userInfo, formatStats, id: panelId} = props;
    const {activePanel} = props.nav;

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

        fetchFriendsInfo(userToken).then((friendsInfo) => {
            setUsersInfo([userInfo, ...friendsInfo]);
        }).catch((error) => {
            setError(error);
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
            setError(error);
        });
    }, [userToken, userInfo, activePanel, formatStats, panelId]);

    // Преобразовываем данные в карточки
    let profileCards = [];
    if (usersInfo) {
        profileCards = usersInfo.map((info, i) =>
            <ProfileCard
                key={info.id}
                info={info}
                stats={stats ? stats[info.id].meanByDays : defaultStats}
                name={i === 0 ? "Мой профиль" : `${info.first_name} ${info.last_name}`}
                goToUserProfile={props.goToUserProfile}
                setActiveUserProfile={props.setActiveUserProfile}
            />
        );
    }

    let content = <Spinner size="large"/>;

    if (error) {
        content = <ErrorPlaceholder error={error}/>;
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

