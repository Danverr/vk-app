import React, { useState } from 'react';
import { Cell, Avatar, Search, List, Group, Header, Placeholder } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import s from './canAddGroup.module.css'

const CanAddGroup = (props) => {
    var [search, setSearch] = useState('');
    const { waitToAdd } = props;
    const searchFriends = () => {
        const searchStr = search.toLowerCase();

        if (!props.canAdd)
            return props.canAdd;
        return props.canAdd.filter(({ first_name, last_name }) => (`${first_name} ${last_name}`).toLowerCase().indexOf(searchStr) > -1);
    }

    const searchedFriends = searchFriends();
    const placeholderText = (props.canAdd.length === 0) ? "Список друзей пуст" : "Пользователи не найдены";

    return (
        <Group header={<Header mode="secondary"> предоставить доступ </Header>}>
            <Search value={search} onChange={(e) => { setSearch(e.target.value); }} after={null} />
            <div className = {s.container}> {
                (!searchedFriends || searchedFriends.length === 0) ? 
                (<Placeholder className = {s.placeHolder}> {placeholderText} </Placeholder>) : (
                    <List>
                        {searchedFriends.map(friend =>
                        <Cell selectable
                            checked={props.waitToAdd.find((waitFriend) => { return waitFriend.id === friend.id; }) != null}
                            onChange={(e) => {
                                if (e.target.checked)
                                    props.updateWaitToAdd([...waitToAdd, friend]);
                                else
                                    props.updateWaitToAdd(waitToAdd.filter((waitFriend) => waitFriend.id !== friend.id));
                            }}
                            key={friend.id}
                            before={<Avatar size={48}
                                src={friend.photo_100} />}
                        >
                            {`${friend.first_name} ${friend.last_name}`}
                        </Cell>)}
                        <div style={{ height: '68px' }} />
                    </List>
                )}
            </div>
        </Group>
    );
};
export default CanAddGroup;