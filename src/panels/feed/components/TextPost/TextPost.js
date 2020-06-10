
import React, { useState } from 'react';
import { Cell, CardGrid, Progress, Avatar, Card, Text, Subhead, InfoRow } from '@vkontakte/vkui';
import s from './TextPost.module.css'
import { getDate, getMonth, getYear, getHours, getMinutes } from '@wojtekmaj/date-utils';
import Icon24MoreVertical from '@vkontakte/icons/dist/24/more_vertical';

import emojiList from '../../../../assets/emoji/emojiList.js';

const TextPost = (props) => {
    const [odd, setOdd] = useState(0);
    const user = props.postData.user;
    const unDate = props.postData.post.date;

    const date = {
        day: getDate(new Date(unDate)),
        month: getMonth(new Date(unDate)) + 1,
        hour: getHours(new Date(unDate)),
        minute: getMinutes(new Date(unDate))
    };

    const description = props.postData.post.title;
    const text = props.postData.post.note;

    const userAva = user.photo_100;
    const currentUser = props.postData.currentUser;

    const moodInt = Number.parseInt(props.postData.post.mood);
    const stressInt = Number.parseInt(props.postData.post.stress);
    const anxietyInt = Number.parseInt(props.postData.post.anxiety);

    const mood = moodInt * 20;
    const stress = stressInt * 20;
    const anxiety = anxietyInt * 20;

    const emojiMood = emojiList.mood[moodInt - 1];
    const emojiStress = emojiList.stress[stressInt - 1];
    const emojiAnxiety = emojiList.anxiety[anxietyInt - 1];

    const summon = () => {
        const equal = { flag: odd, post: props.postData.post };
        props.postData.setLastPost(equal);
        setOdd(!odd);
    }

    return (
        <CardGrid className={s.all}>
            <Card size="l" mode="shadow">

                <Cell className={s.reference} description={<Text> {date.day} {date.month} {date.hour}:{date.minute} </Text>}
                    before={<Avatar size={40} src={userAva} />}
                    asideContent={(user.id === currentUser.id) ?
                        <Icon24MoreVertical onClick={summon} className={s.settingIcon} data-post={props.postData.post.entryId} /> : null}>
                    {<Text> {user.first_name} {user.last_name} </Text>}
                </Cell>

                <div className={s.content}>
                    <Subhead weight='semibold' className={s.title}>
                        {description}
                    </Subhead>
                    <Text weight='medium'>
                        {text}
                    </Text>

                </div>

                <div className={s.parametresField}>

                    <div className={s.parametrText}>
                        <div></div>
                        <Text weight='medium' style={{ 'fontSize': '90%' }}> Настроение </Text>
                        <div></div>
                    </div>
                    <div className={s.parametrProgres}> <div></div> <Progress value={mood} /> <div></div> </div>
                    <div className={s.parametrEmoji}> <div></div> <img src={emojiMood}/> < div ></div> </div>


                    <div className={s.parametrText}>
                        <div></div>
                        <Text weight='medium' style={{ 'fontSize': '90%' }}> Стресс </Text>
                        <div></div>
                    </div>
                    <div className={s.parametrProgres}> <div></div> <Progress value={stress} /> <div></div> </div>

                    <div className={s.parametrEmoji}> <div></div> <img src={emojiStress} /> <div></div> </div>

                    <div className={s.parametrText}>
                        <div></div>
                        <Text weight='medium' style={{ 'fontSize': '90%' }}> Тревожность </Text>
                        <div></div>
                    </div>
                    <div className={s.parametrProgres}> <div></div> <Progress value={anxiety} /> <div></div> </div>

                    <div className={s.parametrEmoji}> <div></div> <img src={emojiAnxiety} /> < div ></div> </div>

                </div>


            </Card>

        </CardGrid>
    );
}

export default TextPost;

/*
 * теги настроения
 *
 *  <div className={s.emojiTegsField}>
                        <div className={s.emojiTegContainer}>
                            <img src={emojiMood} className={s.emoji}>
                            </img>
                            <Text className={s.emojiTegText}>
                                Настроение
                            </Text>
                        </div>


                        <div className={s.emojiTegContainer}>
                            <img src={emojiStress} className={s.emoji}>
                            </img>
                            <Text className={s.emojiTegText}>
                                Стресс
                            </Text>
                        </div>

                        <div className={s.emojiTegContainer}>
                            <img src={emojiAnxiety} className={s.emoji}>
                            </img>
                            <Text className={s.emojiTegText}>
                                Тревожность
                            </Text>
                        </div>
                    </div>
 *
 */