import React from 'react';
import {RichCell, Avatar, Card, Button} from '@vkontakte/vkui';
import "./accessPost.module.css";

const AccessPost = (props) => {
    const user = props.postData.user;
    const nav = props.postData.nav;
    const phr = ["Дала", "Дал"];
    const haveEdge = props.postData.haveEdge;

    return (
        <Card size="l" mode="shadow" className="TextPost">
            <RichCell
                before={<Avatar size={72} src={user.photo_100}/>}
                caption={`${phr[(user.sex === 2) ? 1 : 0]} вам доступ к записям`}
            >
                {`${user.first_name} ${user.last_name}`}
            </RichCell>
            <Button
                size="xl" disabled={haveEdge}
                onClick={() => {
                    nav.goTo("settings");
                    nav.goTo("settings", "friends")
                }}
            >
                {haveEdge && "Вы уже дали доступ"}
                {!haveEdge && "Дать доступ в ответ"}
            </Button>
        </Card>
    );
};

export default AccessPost;