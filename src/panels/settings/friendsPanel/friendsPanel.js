import React, {useState, useEffect, useCallback} from 'react';
import {
    Div,
    FixedLayout,
    Counter,
    Button,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Spinner,
    ScreenSpinner
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";

import api from '../../../utils/api'

import CanAddGroup from './canAddGroup/canAddGroup'
import AddedGroup from './addedGroup/addedGroup'
import ErrorPlaceholder from '../../../components/errorPlaceholder/errorPlaceholder';
import entryWrapper from '../../../components/entryWrapper';

var localState = {
    canAdd: null,
    added: null,
};

const FriendsPanel = (props) => {
    const [error, setError] = useState(null);
    const [canAdd, setCanAdd] = useState(localState.canAdd);
    const [added, setAdded] = useState(localState.added);
    const [VKfriends, setVKfriends] = useState(null);
    const [waitToAdd, setWaitToAdd] = useState([]);
    const {userToken, userInfo} = props.state;

    const cmp = (a, b) => {
        if ((`${a.first_name} ${a.last_name}`) < (`${b.first_name} ${b.last_name}`))
            return -1;
        else if ((`${a.first_name} ${a.last_name}`) > (`${b.first_name} ${b.last_name}`))
            return 1;
        return a.id - b.id;
    }

    const updateCanAdd = useCallback((data) => {
        data.sort(cmp);
        localState.canAdd = data.slice(0);
        setCanAdd(data);
    }, []);
    const updateAdded = useCallback((data) => {
        data.sort(cmp);
        localState.added = data.slice(0);
        setAdded(data);
    }, []);
    const updateWaitToAdd = (data) => {
        setWaitToAdd(data);
    };

    useEffect(() => {
        if (!userToken) return;

        const fetchData = () => {
            bridge.send("VKWebAppCallAPIMethod", {
                method: "friends.get",
                params: {
                    access_token: userToken,
                    v: "5.120",
                    order: "name",
                    fields: "photo_50, photo_100"
                }
            }).then((friends) => {
                setVKfriends(friends.response.items);

                api("GET", "/statAccess/", {
                    type: "toId"
                }).then((edges) => {
                    // Информация о друзьях
                    bridge.send("VKWebAppCallAPIMethod", {
                        method: "users.get",
                        params: {
                            access_token: userToken,
                            v: "5.120",
                            user_ids: edges.data.map((friend) => {
                                return friend.id;
                            }).join(","),
                            fields: "photo_50, photo_100"
                        }
                    }).then((edgesInfo) => {
                        let a = friends.response.items, b = edgesInfo.response;
                        updateCanAdd(a.filter((friend) => !b.find((curFriend) => curFriend.id === friend.id)));
                        updateAdded(b);
                    }).catch((error) => {
                        setError({error: error, reload: fetchData});
                    });
                }).catch((error) => {
                    setError({error: error, reload: fetchData});
                });
            }).catch((error) => {
                setError({error: error, reload: fetchData});
            });
        };

        fetchData();
    }, [userToken, updateCanAdd, updateAdded]);

    const postEdges = async () => {
        if (!userInfo || waitToAdd.length === 0) return;
        waitToAdd.forEach((friend) => {
            entryWrapper.pseudoFriends[friend.id] = 1
        });
        props.setPopout(<ScreenSpinner/>);
        api("POST", "/statAccess/", {
            toId: waitToAdd.map((friend) => {
                return friend.id;
            }).join(', ')
        }).then((res) => {
            updateAdded([...added, ...waitToAdd]);
            updateCanAdd(canAdd.filter((friend) => !waitToAdd.find((curFriend) => curFriend.id === friend.id)));
            updateWaitToAdd([]);
        }).catch((error) => {
            setError({error: error, reload: postEdges});
        }).finally(() => {
            props.setPopout(null);
        });
    };

    const deleteEdge = async (friend) => {
        if (!added || !VKfriends) return;
        entryWrapper.pseudoFriends[friend.id] = null;
        props.setPopout(<ScreenSpinner/>);
        api("DELETE", "/statAccess/", {
            toId: friend.id
        }).then((res) => {
            updateAdded(added.filter((addedFriend) => addedFriend.id !== friend.id));
            if (VKfriends.find((curFriend) => curFriend.id === friend.id))
                updateCanAdd([...canAdd, friend]);
        }).catch((error) => {
            setError({error: error, reload: () => deleteEdge(friend)});
        }).finally(() => {
            props.setPopout(null);
        });
    };

    var content = <Spinner size="large"/>;

    if (error)
        content = <ErrorPlaceholder error={error.error} action={<Button onClick={() => {
            setError(null);
            error.reload();
        }}> Попробовать снова </Button>}/>;
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
                <Div style={{background: 'white'}}>
                    <Button size="xl" after={<Counter> {waitToAdd.length} </Counter>} onClick={() => {
                        postEdges();
                    }}>
                        Сохранить
                    </Button>
                </Div>
            </FixedLayout>
        </div>);

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => {
                props.nav.goBack();
            }}/>}>
                Доступ
            </PanelHeader>
            {content}
        </Panel>
    );
};

export default FriendsPanel;