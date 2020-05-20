
import React from 'react';
import { Cell, CardGrid, Progress, List, Avatar, Card, Text, Title } from '@vkontakte/vkui';
import s from './TextPost.module.css'
import { getDate, getMonth, getYear, getHours, getMinutes } from '@wojtekmaj/date-utils';

const TextPost = (props) => {
    const user = props.postData.user;
    const unDate = props.postData.post.date;
    const date = { day: getDate(new Date(unDate)), month: getMonth(new Date(unDate)), hour: getHours(new Date(unDate)), minute: getMinutes(new Date(unDate)) };
    const description = props.postData.post.title;
    const text = props.postData.post.note;
    const userAva = user.photo_100;
    const mood = Number.parseInt(props.postData.post.mood) * 20;
    const stress = Number.parseInt(props.postData.post.stress) * 20;
    const anxiety = Number.parseInt(props.postData.post.anxiety) * 20;
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

                <div className={s.par}>
                    <div className={s.parName}> <Text weight='medium' className={s.parText}> Настроение </Text> </div>
                    <div className={s.parProgress}> <Progress value={mood}/> </div>
                    <div className={s.parName}>  <Text weight='medium' className={s.parText}> Стресс </Text> </div>
                    <div className={s.parProgress}>  <Progress value={stress} /> </div>
                    <div className={s.parName}>  <Text weight='medium' className={s.parText}> Тревожность </Text> </div>
                    <div className={s.parProgress}>  <Progress value={anxiety} /> </div>
                </div>


                <div style={{ height: 25 }} />
            </Card>
        </CardGrid>
    );
}

export default TextPost;

/*
 *  <Progress value={mood} />
 *
 */