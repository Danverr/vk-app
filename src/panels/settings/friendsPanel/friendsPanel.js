import React, { useState, useEffect, useCallback } from 'react';
import {
    Div,
    FixedLayout,
    Button,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Spinner,
    ScreenSpinner,
    Search,
    Avatar,
    Snackbar,
    Placeholder
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";

import api from '../../../utils/api'

import SearchUsers from './searchUsers/searchUsers'
import ErrorPlaceholder from '../../../components/errorPlaceholder/errorPlaceholder';
import entryWrapper from '../../../components/entryWrapper';

import ModalFilter from './modalFilter'

import Icon16Done from '@vkontakte/icons/dist/16/done'
import s from './friendsPanel.module.css'

const FriendsPanel = (props) => {
    const [snackbar, setSnackbar] = useState(null);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState(null);
    const [statAccess, setStatAccess] = useState(null);
    const [from, setFrom] = useState('none');
    const [to, setTo] = useState('none');
    const [search, setSearch] = useState('');
    const { accessTokenScope, userToken, fetchUserToken } = props.state;

    const cmp = (a, b) => {
        if ((`${a.first_name} ${a.last_name}`) < (`${b.first_name} ${b.last_name}`))
            return -1;
        else if ((`${a.first_name} ${a.last_name}`) > (`${b.first_name} ${b.last_name}`))
            return 1;
        return a.id - b.id;
    }

    const updateUsers = useCallback((data) => {
        data.sort(cmp);
        setUsers(data);
    }, []);

    useEffect(() => {
        if (!userToken) return;

        const fetchData = async () => {
            var friendsIds, toId, fromId;
            await bridge.send("VKWebAppCallAPIMethod", {
                method: "friends.get",
                params: {
                    access_token: userToken,
                    v: "5.120",
                    order: "name",
                    fields: "photo_50, photo_100"
                }
            }).then((friends) => {
                friendsIds = friends.response.items.map(friend => friend.id);
            }).catch((error) => {
                setError({ error: error, reload: fetchData });
            });
            //кому юзер дал доступ
            await api("GET", "/v1.1/statAccess/", {
                type: "toId"
            }).then((edges) => {
                toId = edges.data.map(user => user.id);
                setStatAccess(toId);
            }).catch((error) => {
                setError({ error: error, reload: fetchData });
            });
            //кто дал доступ юзеру
            await api("GET", "/v1.1/statAccess/", {
                type: "fromId"
            }).then((edges) => {
                fromId = edges.data.map(user => user.id);
            }).catch((error) => {
                setError({ error: error, reload: fetchData });
            });

            let res = [...new Set([...friendsIds, ...toId, ...fromId])];

            await bridge.send("VKWebAppCallAPIMethod", {
                method: "users.get",
                params: {
                    access_token: userToken,
                    v: "5.120",
                    user_ids: res.join(","),
                    fields: "photo_50, photo_100, sex"
                }
            }).then((users) => {
                updateUsers(users.response.map(user => {
                    return {
                        toId: toId.indexOf(user.id) !== -1,
                        fromId: fromId.indexOf(user.id) !== -1,
                        ...user
                    };
                }));
            }).catch((error) => {
                setError({ error: error, reload: fetchData });
            });
        }
        fetchData();
    }, [userToken, updateUsers]);

    const changeStatAccess = async (add, del, addf, delf) => {
        try {
            if (addf) {
                props.setPopout(<ScreenSpinner />);
                await api("POST", "/v1.1/statAccess/", {
                    toId: add.join(', ')
                }).then((res) => {
                    add.forEach((id) => {
                        entryWrapper.pseudoFriends[id] = 1;
                    })
                    addf = false;
                    let temp = users;
                    for (var user of temp)
                        if (add.indexOf(user.id) !== -1)
                            user.toId = true;
                    updateUsers(temp);
                    window['yaCounter65896372'].reachGoal("accessGiven");
                }).finally(() => {
                    props.setPopout(null);
                });
            }
            if (delf) {
                props.setPopout(<ScreenSpinner />);
                await api("DELETE", "/v1.1/statAccess/", {
                    toId: del.join(', ')
                }).then((res) => {
                    del.forEach((id) => {
                        entryWrapper.pseudoFriends[id] = 0;
                    })
                    delf = false;
                    let temp = users;
                    for (var user of temp)
                        if (del.indexOf(user.id) !== -1)
                            user.toId = false;
                    updateUsers(temp);
                    window['yaCounter65896372'].reachGoal("accessGiven");
                }).finally(() => {
                    props.setPopout(null);
                });
            }
            if (!addf && !delf)
                setSnackbar(<Snackbar 
                    className = {s.snackbar}
                    layout="vertical"
                    onClose={() => setSnackbar(null)}
                    before={<Avatar size={24} style={{ backgroundColor: 'var(--accent)' }}><Icon16Done
                        fill="#fff" width={14} height={14} /></Avatar>}>
                    Изменения сохранены
                </Snackbar>);
        } catch (error) {
            setError({ error: error, reload: () => changeStatAccess(add, del, addf, delf) });
        }
    }

    const onClickSave = () => {
        const add = [], del = [];
        for (var user of users) {
            if (!user.toId && statAccess.indexOf(user.id) !== -1)
                add.push(user.id);
            if (user.toId && statAccess.indexOf(user.id) === -1)
                del.push(user.id);
        }
        if(add.length === 0 && del.length === 0)
            return;
        changeStatAccess(add, del, add.length > 0, del.length > 0);
    }

    const changeFilter = (res) => {
        setFrom(res.from);
        setTo(res.to);
    }

    var content = <Spinner size="large" />;

    useEffect(() => {
        //разрешение есть, но токен еще не получен
        if(!userToken && accessTokenScope.split(",").indexOf("friends") !== -1)
            fetchUserToken(); //получаем, не показывая плейсхолдер
    }, [userToken, accessTokenScope, fetchUserToken])

    //токен не получен и разрешения нет
    if(!userToken && accessTokenScope.split(",").indexOf("friends") === -1) //показываем плейсхолдер
        content = <Placeholder 
            header="Нужно разрешение"
            stretched
            action={<Button onClick = {() => fetchUserToken()}> Дать разрешение </Button>}> 
            Для редактирования доступа к статистике нам нужен список ваших друзей 
        </Placeholder>;
    else if (error)
        content = <ErrorPlaceholder error={error.error} action={<Button onClick={() => {
            setError(null);
            error.reload();
        }}> Попробовать снова </Button>} />;
    else if (users && statAccess)
        content = (<div>
            <SearchUsers
                search = {search}
                from = {from}
                to = {to}
                users={users}
                statAccess={statAccess}
                setStatAccess={setStatAccess}
            />
            {snackbar}  
            <FixedLayout vertical="bottom">    
                <Div style={{ display: 'flex', background: 'white' }}>
                    <Button size="l"
                        stretched
                        mode="secondary"
                        style={{ marginRight: 8 }}
                        onClick={() => {
                            props.setModal(<ModalFilter
                                to={to}
                                from={from}
                                onClose={() => props.setModal(null)}
                                onChange={changeFilter}
                            />);
                        }}>
                        Фильтры
                    </Button>
                    <Button size="l" stretched onClick={onClickSave}>Сохранить</Button>
                </Div>
            </FixedLayout>
        </div>);

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => {
                props.nav.goBack();
            }} />}>
                Доступ 
            </PanelHeader>
            <FixedLayout vertical="top">
                <Search value={search} onChange={(e) => { setSearch(e.target.value); }}/>
            </FixedLayout>
            <div style = {{paddingTop: 52}}>
                {content}
            </div>
        </Panel>
    );
};

export default FriendsPanel;