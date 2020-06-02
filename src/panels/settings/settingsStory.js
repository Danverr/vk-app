import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelHeader, View, Cell, Switch, CellButton, PanelHeaderBack, Spinner, Avatar, Checkbox, FixedLayout, Separator, Counter, Button, Search, List } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";

import Icon24UserAdd from '@vkontakte/icons/dist/24/user_add';
import Icon24Download from '@vkontakte/icons/dist/24/download';
import Icon24Education from '@vkontakte/icons/dist/24/education';

const SettingsStory = (props) => {
    var [search, setSearch] = useState('');
    var [userFriends, setUserFriends] = useState(null);

    useEffect(() => {
        if (!props.userToken) return;

        const fetchUserFriends = async () => {
            const friendsPromise = await bridge.send("VKWebAppCallAPIMethod", {
                method: "friends.get",
                params: {
                    access_token: props.userToken,
                    v: "5.103",
                    order: "name",
                    fields: "photo_50, photo_100"
                }
            });
            setUserFriends(friendsPromise.response);
        }
        fetchUserFriends();
    }, [props.userToken]);

    const searchFriends = () =>{
        const searchStr = search.toLowerCase();           
        if(!userFriends) 
            return userFriends;
        return userFriends.items.filter(({first_name, last_name}) => (`${first_name} ${last_name}`).toLowerCase().indexOf(searchStr) > -1);
    }

    const searchedFriends = searchFriends();

    return (
        <View id={props.id}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false} >Настройки</PanelHeader>
                <CellButton before={<Icon24UserAdd />} onClick={() => { props.nav.goTo(props.id, "friends"); }}> Добавить друга </CellButton>
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
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }}/>} > 
                    Друзья
                </PanelHeader>
                <Search value={search} onChange={(e) => {console.log(e.target.value); setSearch(e.target.value);}} after={null}/>
                {
                searchedFriends && searchedFriends.length > 0 &&
                    <List>
                        {searchedFriends.map(friend => <Cell before={<Avatar size={48} src={friend.photo_100} />} asideContent={<Checkbox/>}>{`${friend.first_name} ${friend.last_name}`}</Cell>)}
                    </List>
                }
                <FixedLayout vertical="bottom">
                    <Separator wide />
                    <Button size="xl" after={<Counter> {0} </Counter>} onClick={() => { props.nav.goBack(); }}> Отправить </Button>
                </FixedLayout>
            </Panel>
        </View>
    );
};

export default SettingsStory;

