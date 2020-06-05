import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelHeader, View, Cell, Switch, CellButton, PanelHeaderBack, Avatar, Checkbox, FixedLayout, Separator, Counter, Button, Search, List, Group, Header } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";

import Icon24UserAdd from '@vkontakte/icons/dist/24/user_add';
import Icon24Download from '@vkontakte/icons/dist/24/download';
import Icon24Education from '@vkontakte/icons/dist/24/education';

import api from '../../utils/api'

import CanAddGroup from './canAdd/canAddGroup'
import AddedGroup from './added/addedGroup'

const SettingsStory = (props) => {
    var [canAdd, setCanAdd] = useState(null);
    var [added, setAdded] = useState(null);
    var [waitToAdd, setWaitToAdd] = useState([]);

    useEffect(() => {
        if (!props.state.userToken) return;

        const fetchUserFriends = async () => {
            const friendsInfoPromise = await bridge.send("VKWebAppCallAPIMethod", {
                method: "friends.get",
                params: {
                    access_token: props.state.userToken,
                    v: "5.103",
                    order: "name",
                    fields: "photo_50, photo_100"
                }
            });

            const addedPromise = await api("GET", "/statAccess/", {
                fromId: props.state.userInfo.id,
            });

            const addedFriendsInfoPromise = await bridge.send("VKWebAppCallAPIMethod", {
                method: "users.get",
                params: {
                    access_token: props.state.userToken,
                    v: "5.103",
                    user_ids: addedPromise.data.join(","),
                    fields: "photo_50, photo_100"
                }
            });

            let temp1 = [...friendsInfoPromise.response.items],
                temp2 = [...addedPromise.data];
            temp1 = temp1.filter((friend) => temp2.indexOf(friend.id) == -1);
            temp2 = [...addedFriendsInfoPromise.response];

            setCanAdd(temp1);
            setAdded(temp2);
        }
        fetchUserFriends();
    }, [props.state.userToken]);

    const postEdges = async () => {
        if (!props.state.userInfo) return;

        waitToAdd.map((friend) => {
            api("POST", "/statAccess/", {
                fromId: props.state.userInfo.id,
                toId: friend.id
            });
        })
        setCanAdd([...canAdd.filter((friend) => waitToAdd.indexOf(friend) == -1)]);
        setAdded([...added, ...waitToAdd]);
    }
    
    return (
        <View id={props.id}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false} >Настройки</PanelHeader>
                <CellButton before={<Icon24UserAdd />} onClick={() => { props.nav.goTo(props.id, "friends"); }}> Добавить из списка друзей </CellButton>
                <Cell asideContent={<Switch />}>
                    Напоминания о создании записи
                </Cell>
                <Cell asideContent={<Switch />}>
                    Уведомления о здоровье друзей
                </Cell>
                <CellButton before={<Icon24Download />}> Импорт записей из Daylio </CellButton>
                <CellButton before={<Icon24Education />}> Пройти обучение </CellButton>
            </Panel>
            <Panel id="friends">
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }} />} >
                    Друзья
                </PanelHeader>
                <AddedGroup
                    added={added}
                    canAdd={canAdd}
                    userInfo={props.state.userInfo}
                    remove={
                        (friend) => {
                            let temp = [...added];
                            temp.splice(temp.indexOf(friend), 1);
                            setCanAdd([...canAdd, friend]);
                            setAdded(temp);
                        }} />
                <CanAddGroup
                    added={added}
                    canAdd={canAdd}
                    waitToAdd={waitToAdd}
                    add={
                        (friend) => {
                            let temp = [...waitToAdd];
                            temp.push(friend);
                            setWaitToAdd(temp);
                        }}
                    remove={
                        (friend) => {
                            let temp = [...waitToAdd];
                            if (temp.indexOf(friend) > -1)
                                temp.splice(temp.indexOf(friend), 1);
                            setWaitToAdd(temp);
                        }} />
                <FixedLayout vertical="bottom">
                    <Separator wide />
                    <Button size="xl" after={<Counter> {waitToAdd.length} </Counter>} onClick={() => {
                        postEdges();
                        setWaitToAdd([]);
                        props.nav.goBack();
                    }}>
                        Сохранить
                    </Button>
                </FixedLayout>
            </Panel>
        </View>
    );
};

export default SettingsStory;

