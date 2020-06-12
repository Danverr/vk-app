
import React, { useState, useEffect } from 'react';
import { Cell, CardGrid, Progress, Avatar, Card, Text, Subhead, InfoRow } from '@vkontakte/vkui';
import s from './TextPost.module.css'
import Icon24MoreVertical from '@vkontakte/icons/dist/24/more_vertical';

import emojiList from '../../../../assets/emoji/emojiList.js';

const TextPost = (props) => {
    const [odd, setOdd] = useState(0);

    const dat = props.postData;;
    const user = dat.user;

    const dateField = dat.post.dateField;
    const description = dat.post.title;
    const text = dat.post.note;

    const userAva = user.photo_100;
    const currentUser = dat.currentUser;

    const moodInt = Number.parseInt(dat.post.mood);
    const stressInt = Number.parseInt(dat.post.stress);
    const anxietyInt = Number.parseInt(dat.post.anxiety);

    const mood = moodInt * 20;
    const stress = stressInt * 20;
    const anxiety = anxietyInt * 20;

    const emojiMood = emojiList.mood[moodInt - 1];
    const emojiStress = emojiList.stress[stressInt - 1];
    const emojiAnxiety = emojiList.anxiety[anxietyInt - 1];

    const summon = () => {
        const equal = { flag: odd, post: dat.post };
        dat.setLastPost(equal);
        setOdd(!odd);
    }

    return (
        <CardGrid className={s.all}>
            <Card size="l" mode="shadow">

                <Cell className={s.reference} description={<Text> {dateField} </Text>}
                    before={<Avatar size={40} src={userAva} />}
                    asideContent={(user.id === currentUser.id) ?
                        <Icon24MoreVertical onClick={summon} className={s.settingIcon} data-post={dat.post.entryId} /> : null}>
                    {<Text> {user.first_name} {user.last_name} </Text>}
                </Cell>

                {(description !== "" || text !== "") ? <div className={s.content}>
                    <Subhead weight='bold' className={s.title}>
                        {description}
                    </Subhead>
                    <Text weight='regular'>
                        {text}
                    </Text>

                </div> : null}


                <div className={s.parametresField}>
                    <div className={s.parametrText}>
                        <div></div>
                        <Text weight='regular' style={{ 'fontSize': '85%' }}> Настроение </Text>
                        <div></div>
                    </div>
                    <div className={s.parametrProgres}> <div></div> <Progress value={mood} /> <div></div> </div>
                    <div className={s.parametrEmoji}> <div></div> <img src={emojiMood} /> < div ></div> </div>


                    <div className={s.parametrText}>
                        <div></div>
                        <Text weight='regular' style={{ 'fontSize': '85%' }}> Стресс </Text>
                        <div></div>
                    </div>
                    <div className={s.parametrProgres}> <div></div> <Progress value={stress} /> <div></div> </div>

                    <div className={s.parametrEmoji}> <div></div> <img src={emojiStress} /> <div></div> </div>

                    <div className={s.parametrText}>
                        <div></div>
                        <Text weight='regular' style={{ 'fontSize': '85%' }}> Тревожность </Text>
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