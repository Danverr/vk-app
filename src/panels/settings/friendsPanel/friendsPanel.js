import React, { useState, useEffect } from 'react';
import { Div, FixedLayout, Counter, Button, Panel, PanelHeader, PanelHeaderBack, Spinner, ScreenSpinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";

import api from '../../../utils/api'

import CanAddGroup from './canAddGroup/canAddGroup'
import AddedGroup from './addedGroup/addedGroup'
import ErrorPlaceholder from '../../../components/errorPlaceholder/errorPlaceholder';

var localState = {
    VKFriendsInfo: null,
    edgesInfo: null,
    canAdd: null,
    added: null,
};

const FriendsPanel = (props) => {
    const [error, setError] = useState(null);
    const [VKFriendsInfo, setVKFriendsInfo] = useState(localState.VKFriendsInfo);
    const [edgesInfo, setEdgesInfo] = useState(localState.edgesInfo);
    const [canAdd, setCanAdd] = useState(localState.canAdd);
    const [added, setAdded] = useState(localState.added);
    const [waitToAdd, setWaitToAdd] = useState([]);
    const { userToken, userInfo } = props.state;

    const cmp = (a, b) => {
        if ((`${a.first_name} ${a.last_name}`) < (`${b.first_name} ${b.last_name}`))
            return -1;
        else if ((`${a.first_name} ${a.last_name}`) > (`${b.first_name} ${b.last_name}`))
            return 1;
        return a.id - b.id;
    }

    const updateVKFriendsInfo = (data) => {
        localState.VKFriendsInfo = {...data};
        setVKFriendsInfo(data);
    }
    const updateEdgesInfo = (data) => {
        localState.edgesInfo = data.slice(0);
        setEdgesInfo(data);
    }
    const updateCanAdd = (data) => {
        data.sort(cmp);
        localState.canAdd = data.slice(0);
        setCanAdd(data);
    }
    const updateAdded = (data) => {
        data.sort(cmp);
        localState.added = data.slice(0);
        setAdded(data);
    }
    const updateWaitToAdd = (data) => {
        setWaitToAdd(data);
    }

    useEffect(() => {
        if (!userToken) return;

        const fetchVKFriendsInfo = async () => {
            bridge.send("VKWebAppCallAPIMethod", {
                method: "friends.get",
                params: {
                    access_token: userToken,
                    v: "5.103",
                    order: "name",
                    fields: "photo_50, photo_100"
                }
            }).then((res) => {
                updateVKFriendsInfo(res.response);
            }).catch((error) => {
                setError(error);
            });
        }
        const fetchEdgesInfo = async () => {
            // ID друзей к которым есть доступ
            api("GET", "/statAccess/", {
                type: "toId"
            }).then((res) => {
                // Информация о друзьях
                bridge.send("VKWebAppCallAPIMethod", {
                    method: "users.get",
                    params: {
                        access_token: userToken,
                        v: "5.103",
                        user_ids: res.data.join(","),
                        fields: "photo_50, photo_100"
                    }
                }).then((res) => {
                    updateEdgesInfo(res.response);
                }).catch((error) => {
                    setError(error);
                });
            }).catch((error) => {
                setError(error);
            });
        };
        fetchVKFriendsInfo();
        fetchEdgesInfo();
    }, [userToken]);

    useEffect(() => {
        if (VKFriendsInfo == null || edgesInfo == null)
            return;

        updateCanAdd(VKFriendsInfo.items.filter((friend) => !edgesInfo.find((curFriend) => curFriend.id == friend.id)));
        updateAdded(edgesInfo);
    }, [VKFriendsInfo, edgesInfo])

    const postEdges = async () => {
        if (!userInfo) return;
        props.setPopout(<ScreenSpinner/>);
        api("POST", "/statAccess/", {
            toId: waitToAdd.map((friend) => { return friend.id; }).join(', ')
        }).then((res) => {
            updateAdded([...added, ...waitToAdd]);
            updateCanAdd(canAdd.filter((friend) => !waitToAdd.find((curFriend) => curFriend.id == friend.id)));
            updateWaitToAdd([]);
        }).catch((error) => {
            setError(error);
        }).finally(() => {
            props.setPopout(null);
        });
    }

    const deleteEdge = async (friend) => {
        if (!userInfo) return;
        props.setPopout(<ScreenSpinner/>);
        api("DELETE", "/statAccess/", {
            toId: friend.id
        }).then((res) => {
            updateAdded(added.filter((addedFriend) => addedFriend.id != friend.id));
            updateCanAdd([...canAdd, friend]);
        }).catch((error) => {
            setError(error);
        }).finally(() => {
            props.setPopout(null);
        });
    }

    var content = <Spinner size="large" />;

    if (error)
        content = <ErrorPlaceholder error={error} />;
    else if (added && canAdd)
        content = (<div>
            <AddedGroup
                added={added}
                deleteEdge={deleteEdge}/>
            <CanAddGroup
                canAdd={canAdd}
                waitToAdd={waitToAdd}
                updateWaitToAdd={updateWaitToAdd}/>
            <FixedLayout vertical="bottom">
                <Div style = {{background: 'white'}}>
                    <Button size="xl" after={<Counter> {waitToAdd.length} </Counter>} onClick={() => {postEdges();}}>
                        Сохранить
                    </Button>
                </Div>
            </FixedLayout>
            </div>);

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }} />} >
                Доступ
            </PanelHeader>
            {content}
        </Panel>
    );
}
export default FriendsPanel;