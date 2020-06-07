import React, { useState, useEffect } from 'react';
import { Cell, Avatar, Search, List, Group, Header } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const CanAddGroup = (props) => {
    var [search, setSearch] = useState('');

    const searchFriends = () => {
        const searchStr = search.toLowerCase();

        if (!props.canAdd)
            return props.canAdd;
        return props.canAdd.filter(({ first_name, last_name }) => (`${first_name} ${last_name}`).toLowerCase().indexOf(searchStr) > -1);
    }

    const searchedFriends = searchFriends();

    return (
        <Group header={<Header mode="secondary"> добавить </Header>}>
            <Search value={search} onChange={(e) => { setSearch(e.target.value); }} after={null} />
            {
                searchedFriends && searchedFriends.length > 0 &&
                <List>
                    {searchedFriends.map(friend =>
                        <Cell selectable
                            checked = {props.waitToAdd.find((waitFriend) => waitFriend.id == friend.id)}
                            onChange={(e) => {
                                if (e.target.checked){
                                    props.setWaitToAdd((waitToAdd) => {
                                        let temp = [...waitToAdd];
                                        temp.push(friend);
                                        return temp;
                                    });
                                }
                                else{
                                    props.setWaitToAdd((waitToAdd) => {
                                        let temp = [...waitToAdd];
                                        temp.splice(temp.indexOf(temp.find((waitFriend) => waitFriend.id == friend.id)), 1);
                                        return temp;
                                    });
                                }
                            }}
                            key={friend.id}
                            before={<Avatar size={48}
                                src={friend.photo_100} />}
                        >
                            {`${friend.first_name} ${friend.last_name}`}
                        </Cell>)}
                </List>
            }
        </Group>
    );
};
export default CanAddGroup;