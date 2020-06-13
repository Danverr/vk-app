import React from 'react';
import { Avatar, List, Cell, Group, Header } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const AddedGroup = (props) => { 
    return (
        <Group header={<Header mode="secondary"> добавленные </Header>}>
            {   props.added != null &&
                <List>
                    {props.added.map((friend) =>
                        <Cell removable
                            onRemove={() => {props.deleteEdge(friend)}}
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