import React, { useState, useEffect } from 'react';
import { Div, FixedLayout, Counter, Button, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import api from '../../utils/api'

import CanAddGroup from './canAdd/canAddGroup'
import AddedGroup from './added/addedGroup'

const FriendsPanelContent = (props) => {
    var [canAdd, setCanAdd] = useState(null);
    var [added, setAdded] = useState(null);
    var [waitToAdd, setWaitToAdd] = useState([]);

    useEffect(() => {
        if (!props.state.userToken) return;

        props.state.fetchVKFriendsInfo();
        props.state.fetchFromEdgesInfo();
    }, [props.state.userToken]);

    useEffect(() => {
        if (props.state.VKFriendsInfo == null || props.state.fromEdgesInfo == null)
            return;
        setCanAdd(props.state.VKFriendsInfo.items.filter((friend) => !props.state.fromEdgesInfo.find((curFriend) => curFriend.id == friend.id)));
        setAdded(props.state.fromEdgesInfo);
    }, [props.state.VKFriendInfo, props.state.fromEdgesInfo])

    const postEdges = async () => {
        if (!props.state.userInfo) return;
        for (var friend of waitToAdd) {
            await api("POST", "/statAccess/", {
                fromId: props.state.userInfo.id,
                toId: friend.id
            });
        }
    }

    const deleteEdge = async (friend) => {
        if (!props.state.userInfo) return;

        const deleteEdgePromise = await api("DELETE", "/statAccess/", {
            fromId: props.state.userInfo.id,
            toId: friend.id
        });

        //ребро успешно удалено
        if (deleteEdgePromise.status == 204) {
            setAdded(added.filter((addedFriend) => addedFriend.id != friend.id));
            setCanAdd(([...canAdd, friend]).sort((a, b) => {
                if ((`${a.first_name} ${a.last_name}`) < (`${b.first_name} ${b.last_name}`))
                    return -1;
                else if ((`${a.first_name} ${a.last_name}`) < (`${b.first_name} ${b.last_name}`))
                    return 0;
                return 1;
            }));
        }
    }

    return (
        <div>
            <AddedGroup
                added={added}
                deleteEdge={deleteEdge}
            />
            <CanAddGroup
                canAdd={canAdd}
                waitToAdd = {waitToAdd}
                setWaitToAdd={setWaitToAdd}
            />
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
export default FriendsPanelContent;