import React from 'react';
import { Cell, Avatar, List, Placeholder, Div, Button } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import s from './searchUsers.module.css'

const SearchUsers = (props) => {
    const {users, statAccess, setStatAccess, from, to, search} = props;

    const searchFriends = () => {
        const searchStr = search.toLowerCase();

        if (users === null)
            return null;
        let res = users.filter(({ first_name, last_name }) => (`${first_name} ${last_name}`).toLowerCase().indexOf(searchStr) > -1);

        if(from === 'yes')
            res = res.filter(({fromId}) => fromId);
        else if(from === 'no')
            res = res.filter(({fromId}) => !fromId);
        if(to === 'yes')
            res = res.filter(({toId}) => toId);
        else if(to === 'no')
            res = res.filter(({toId}) => !toId);
        return res;
    }

    const searchedFriends = searchFriends();
    const placeholderText = (!users || users.length === 0) ? "Список друзей пуст" : "Пользователи не найдены";
    const searchedIds = searchedFriends.map(user => user.id);

    const getDescription = (sex) => {
        switch(sex){
            case 0:
                return "Дал(а) вам доступ";
            case 1:
                return "Далa вам доступ";
            case 2:
                return "Дал вам доступ";
            default:
                break;
        }
    }
 
    return (
        <div>
            <Div className = {s.controls}>
                <Button
                    size="l"
                    stretched
                    mode="tertiary"
                    style={{ marginRight: 8 }}
                    onClick={() => setStatAccess([...new Set([...statAccess, ...searchedIds])])}>
                    Выбрать всех
                </Button>
                <Button
                    size="l"
                    stretched
                    mode="tertiary"
                    onClick={() => setStatAccess(statAccess.filter((user) => searchedIds.indexOf(user) === -1))}>
                    Очистить
                </Button>
            </Div>
            <div className={s.container}> {
                (searchedFriends.length === 0) ?
                    (<Placeholder> {placeholderText} </Placeholder>) : (
                        <List style = {{width: '100%'}}>
                            {searchedFriends.map(friend =>
                                <Cell selectable
                                    checked={statAccess.indexOf(friend.id) !== -1}
                                    onChange={(e) => {
                                         if (e.target.checked)
                                            setStatAccess([...statAccess, friend.id]);
                                         else
                                            setStatAccess(statAccess.filter((user) => user !== friend.id));
                                    }}
                                    description = {(friend.fromId) ? getDescription(friend.sex) : null}
                                    key={friend.id}
                                    before={<Avatar size={48} src={friend.photo_100} />}>
                                    {`${friend.first_name} ${friend.last_name}`}
                                </Cell>
                            )}
                            <div style={{ height: '62px' }} />
                        </List>
                    )}
            </div>
        </div>
    );
};
export default SearchUsers;