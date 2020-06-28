
import React, { useState } from 'react';
import { Cell, Progress, Avatar, Card, Text, Subhead, ActionSheet, ActionSheetItem } from '@vkontakte/vkui';
import s from './TextPost.module.css'
import Icon24MoreVertical from '@vkontakte/icons/dist/24/more_vertical';
import { platform, IOS } from '@vkontakte/vkui';

import DeleteBar from '../DeleteBar/DeleteBar.js';
import emojiList from '../../assets/emoji/emojiList.js';
import { getDateDescription } from './../../utils/chrono.js'

const getDate = (date, timezone) => {
    const x = new Date(date);
    x.setHours(x.getHours() + timezone);
    return x;
}

const TextPost = (props) => {
    const dat = props.postData;;
    const user = dat.user;
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

    const postDate = getDate(dat.post.date, dat.currentUser.timezone);

    const [dateField, setDateField] = useState(getDateDescription(postDate, new Date()));

    const deletePost = () => {
        dat.deletePostFromBase(dat.post.entryId);
        dat.deletePostFromList(dat);
        dat.setPostWasDeleted(< DeleteBar
            cancelDelete={returnPost}
            onClose={() => { dat.setPostWasDeleted(null) }}
        />);
    }

    const returnPost = () => {
        dat.addPostToBase(dat.post).then((result) => {
            dat.post.entryId = result.data;
            dat.addPostToList(dat);
        });
    }

    const onClose = () => {
        dat.setDeleted(0);
        dat.setCurPopout(null);
    };

    const onSettingClick = () => {
        dat.checkPopout();
        dat.setCurPopout(
            <ActionSheet onClose={onClose}>
                <ActionSheetItem onClick={() => { alert("YES!") }} autoclose> <Text> Редактировать пост </Text> </ActionSheetItem>
                <ActionSheetItem onClick={deletePost} autoclose mode="destructive"> <Text> Удалить пост </Text>  </ActionSheetItem>
                {platform() === IOS && <ActionSheetItem autoclose mode="cancel"> <Text> Отменить </Text> </ActionSheetItem>}
            </ActionSheet>);
    }

    const parametrField = () => {
        return (
            <div className={s.parametresField}>

                <div className={s.parametrText}>
                    <div />
                    <Text weight='regular' style={{ 'fontSize': '85%' }}> Настроение </Text>
                    <div />
                </div>
                <div className={s.parametrProgres}> <div /> <Progress value={mood} /> <div /> </div>
                <div className={s.parametrEmoji}> <div /> <img src={emojiMood} style={{ 'height': '24px', 'width': '24px' }}/> <div /> </div>

                <div className={s.parametrText}>
                    <div />
                    <Text weight='regular' style={{ 'fontSize': '85%' }}> Стресс </Text>
                    <div />
                </div>
                <div className={s.parametrProgres}> <div /> <Progress value={stress} /> <div /> </div>
                <div className={s.parametrEmoji}> <div /> <img src={emojiStress} style={{ 'height': '24px', 'width': '24px' }} /> <div /> </div>

                <div className={s.parametrText}>
                    <div />
                    <Text weight='regular' style={{ 'fontSize': '85%' }}> Тревожность </Text>
                    <div />
                </div>
                <div className={s.parametrProgres}> <div /> <Progress value={anxiety} /> <div /> </div>
                <div className={s.parametrEmoji}> <div /> <img src={emojiAnxiety} style={{ 'height':'24px', 'width':'24px'}} /> <div /> </div>
            </div>
            );
    };

    const cmpId = (!currentUser) ? -42394239 : currentUser.id;

    const postWithData = () => {
        return (
            <Card size="l" mode="shadow" className={s.all}>
                <Cell className={s.reference} description={<Text> {dateField} </Text>}
                    before={<Avatar size={40} src={userAva} />}
                    asideContent={(user.id === cmpId) ?
                        <Icon24MoreVertical onClick={onSettingClick} className={s.settingIcon} /> : null}>
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
                {parametrField()}
            </Card>
        );
    }

    return postWithData();
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
