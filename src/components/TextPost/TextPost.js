
import React from 'react';
import { Cell, CardGrid } from '@vkontakte/vkui';
import s from './TextPost.module.css'
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Card from '@vkontakte/vkui/dist/components/Card/Card'
import Text from '@vkontakte/vkui/dist/components/Typography/Text/Text'
import Title from '@vkontakte/vkui/dist/components/Typography/Title/Title'
import { getDate, getMonth, getYear, getHours, getMinutes } from '@wojtekmaj/date-utils';

const TextPost = (props) => {
    const user = props.postData.user;
    const unDate = props.postData.post.date;
    const date = { day: getDate(new Date(unDate)), month: getMonth(new Date(unDate)), hour: getHours(new Date(unDate)), minute: getMinutes(new Date(unDate)) };
    const description = props.postData.post.title;
    const text = props.postData.post.note;
    const userAva = ((user.photo_50 != null) ? user.photo_50 : user.photo_200);
    return (
        <CardGrid className={s.content}>
            <Card size="l" mode="shadow">
                <Cell className={s.reference} description={`${date.day} ${date.month} ${date.hour}:${date.minute}`}
                    before={<Avatar size={40} src={userAva} />}
                >
                    {`${user.first_name} ${user.last_name}`}
                </Cell>
                <Title level='3' weight='semibold' className={s.description} >
                    {description}
                </Title>
                <Text weight='medium' className={s.postText} >
                    {text}
                </Text>
                <div style={{ height: 25 }} />
            </Card>
        </CardGrid>
    );
}

export default TextPost;