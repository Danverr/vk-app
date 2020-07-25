import React from 'react';
import { Cell, Avatar, Card, Text, Button } from '@vkontakte/vkui';

const AccesEntry = (props) => {
    const user = props.postData.user;
    const nav = props.postData.nav;
    const phr = ["Дала", "Дал"];
    const haveEdge = props.postData.haveEdge;
    const getDescription = () => {
        let str = phr[(user.sex === 2) ? 1 : 0];
        str += " вам доступ к записям";
        return <Text>{str}</Text>;
    };
    return (
        <Card size="l" mode="shadow" className="TextPost">
            <Cell
                before={<Avatar size={72} src={user.photo_100} />}
                description={getDescription()}
            >
                <Text> {user.first_name} {user.last_name} </Text>
            </Cell>
            <Button onClick={() => { nav.goTo("settings"); nav.goTo("settings", "friends") }}
                size="xl" disabled={haveEdge} style={{ 'marginTop': '12px' }}>
                {haveEdge && <Text> Вы уже дали доступ </Text>}
                {!haveEdge && <Text> Дать доступ в ответ </Text>}
            </Button>
        </Card>
    );
};

export default AccesEntry;