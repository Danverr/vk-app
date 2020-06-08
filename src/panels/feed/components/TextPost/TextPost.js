
import React from 'react';
import { Cell, CardGrid, Progress, Avatar, Card, Text, Subhead } from '@vkontakte/vkui';
import s from './TextPost.module.css'
import { getDate, getMonth, getYear, getHours, getMinutes } from '@wojtekmaj/date-utils';
import Icon24MoreVertical from '@vkontakte/icons/dist/24/more_vertical';

import mood1 from '../../../../assets/emoji/mood/mood1.png'
import mood2 from '../../../../assets/emoji/mood/mood2.png'
import mood3 from '../../../../assets/emoji/mood/mood3.png'
import mood4 from '../../../../assets/emoji/mood/mood4.png'
import mood5 from '../../../../assets/emoji/mood/mood5.png'

import stress1 from '../../../../assets/emoji/stress/stress1.png'
import stress2 from '../../../../assets/emoji/stress/stress2.png'
import stress3 from '../../../../assets/emoji/stress/stress3.png'
import stress4 from '../../../../assets/emoji/stress/stress4.png'
import stress5 from '../../../../assets/emoji/stress/stress5.png'

import anxiety1 from '../../../../assets/emoji/anxiety/anxiety1.png'
import anxiety2 from '../../../../assets/emoji/anxiety/anxiety2.png'
import anxiety3 from '../../../../assets/emoji/anxiety/anxiety3.png'
import anxiety4 from '../../../../assets/emoji/anxiety/anxiety4.png'
import anxiety5 from '../../../../assets/emoji/anxiety/anxiety5.png'
import DeleteBar from '../DeleteBar/DeleteBar';

const TextPost = (props) => {
    const user = props.postData.user;
    const unDate = props.postData.post.date;

    const date = {
        day: getDate(new Date(unDate)), month: getMonth(new Date(unDate)) + 1, hour: getHours(new Date(unDate)), minute: getMinutes(new Date(unDate))
    };
    const description = props.postData.post.title;
    const text = props.postData.post.note;

    const userAva = user.photo_100;
    const currentUser = props.postData.currentUser;

    const moodInt = Number.parseInt(props.postData.post.mood);
    // тк с сервака мне пока не удалось получить записи с интами, оставил парсинг
    const stressInt = Number.parseInt(props.postData.post.stress);
    const anxietyInt = Number.parseInt(props.postData.post.anxiety);

    const mood = moodInt * 20;
    const stress = stressInt * 20;
    const anxiety = anxietyInt * 20;

    const moods = [mood1, mood2, mood3, mood4, mood5];
    const anxietys = [anxiety1, anxiety2, anxiety3, anxiety4, anxiety5];
    const stresses = [stress1, stress2, stress3, stress4, stress5];

    const emojiMood = moods[moodInt - 1];
    const emojiStress = stresses[stressInt - 1];
    const emojiAnxiety = anxietys[anxietyInt - 1];

    return (
        <CardGrid className={s.all}>
            <Card size="l" mode="shadow">

                <Cell className={s.reference} description={`${date.day} ${date.month} ${date.hour}:${date.minute}`}
                    before={<Avatar size={40} src={userAva} />}
                    asideContent={(user.id === currentUser.id) ?
                        <Icon24MoreVertical onClick={props.postData.func} className={s.settingIcon} data-post={props.postData.post.entryId} /> : null}>
                    {`${user.first_name} ${user.last_name}`}
                </Cell>

                <div className={s.content}>
                    <Subhead weight='semibold' className={s.title}>
                        {description}
                    </Subhead>
                    <Text weight='medium'>
                        {text}
                    </Text>

                    <div className={s.emojiTegsField}>
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


                </div>




            </Card>

        </CardGrid>
    );
}

export default TextPost;

