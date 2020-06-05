import React, { useState, useEffect, useRef } from 'react';
import { Div, FixedLayout, Separator, Counter, Button, Search, List, Group, Header } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";

import api from '../../utils/api'

import CanAddGroup from './canAdd/canAddGroup'
import AddedGroup from './added/addedGroup'

const FriendsPanel = (props) => {
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
        <div>
            <AddedGroup
                added={added}
                canAdd={canAdd}
                userInfo={props.state.userInfo}
                remove={
                    (friend) => {
                        let temp = [...added];
                        temp.splice(temp.indexOf(friend), 1);
                        let temp1 = [...canAdd, friend];
                        setCanAdd(temp1.sort((a, b) => {
                            if((`${a.first_name} ${a.last_name}`) < (`${b.first_name} ${b.last_name}`)) 
                                return -1; 
                            else if((`${a.first_name} ${a.last_name}`) < (`${b.first_name} ${b.last_name}`))
                                return 0;
                            return 1;
                        }));
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
                <Div>
                    <Button size="xl" after={<Counter> {waitToAdd.length} </Counter>} onClick={() => {
                        postEdges();
                        setWaitToAdd([]);
                        props.nav.goBack();
                    }}>
                        Сохранить
                    </Button>
                </Div>
            </FixedLayout>
        </div>
    );
}
export default FriendsPanel;