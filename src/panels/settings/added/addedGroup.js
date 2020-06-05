import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelHeader, View, Cell, Switch, CellButton, PanelHeaderBack, Avatar, Checkbox, FixedLayout, Separator, Counter, Button, Search, List, Group, Header } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";

import api from '../../../utils/api'

const AddedGroup = (props) => {
    var [search, setSearch] = useState('');
    
    const searchFriends = () => {
        const searchStr = search.toLowerCase();

        if (!props.added)
            return props.added;
        return props.added.filter(({ first_name, last_name }) => (`${first_name} ${last_name}`).toLowerCase().indexOf(searchStr) > -1);
    }

    const searchedFriends = searchFriends();
    
    const deleteEdge = async (friend) => {
        if (!props.usersInfo) return;

        const res = await api("DELETE", "/statAccess/", {
            fromId: props.usersInfo[0].id,
            toId: friend.id
        });
        props.remove(friend);
    }

    return (
        <Group header={<Header mode="secondary"> добавленные </Header>}>
            <Search value={search} onChange={(e) => { setSearch(e.target.value); }} after={null} />
            {
                searchedFriends && searchedFriends.length > 0 &&
                <List>
                    {searchedFriends.map(friend =>
                        <Cell removable
                            onRemove={() => {deleteEdge(friend)}}
                            key={friend.id}
                            before={<Avatar size={48}
                            src={friend.photo_100} />}>
                            {`${friend.first_name} ${friend.last_name}`}
                        </Cell>)}
                </List>
            }
        </Group>
    );
};
export default AddedGroup;