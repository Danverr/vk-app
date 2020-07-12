
import React, { useState } from 'react';
import {
    Cell, Avatar, Card, Text, Subhead, ActionSheet, ActionSheetItem, Alert
} from '@vkontakte/vkui';
import s from './TextPost.module.css'
import Icon24MoreVertical from '@vkontakte/icons/dist/24/more_vertical';
import { platform, IOS } from '@vkontakte/vkui';

import ProgressBar from '../ProgressBar/ProgressBar'
import DeleteBar from '../DeleteBar/DeleteBar'

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
    const [upd, setUpd] = useState(0);

    /* пост каждую минуту обновляет свое время */
    const updateDateField = () => {
        setTimeout(() => {
            setDateField(getDateDescription(postDate, new Date()));
            setUpd(!upd);
        }, 60 * 1000);
    };

    const editPost = () => {

    };

    const deletePost = () => {
        dat.states.deleteEntryFromList(dat);
        dat.states.deleteEntryFromBase(dat.post.entryId);
        dat.states.setDeletedEntryField(<DeleteBar onClose={dat.states.setCurPopout} />)
    };

    const queryDeletePost = () => {
        dat.states.setCurPopout(
            <Alert
                actions={
                    [{
                        title: 'Нет',
                        autoclose: true,
                        mode: 'cancel'
                    },
                    {
                        title: 'Да',
                        autoclose: true,
                        action : deletePost
                    }]
                }
                onClose={() => { dat.states.setCurPopout(null); }}
            >
                <h2> <Text> Подтверждение </Text> </h2>
                <p> <Text> Вы действительно хотите удалить эту запись? </Text> </p>
            </Alert>
        );
    }

    const onSettingClick = () => {
        dat.states.setDeletedEntryField(null);
        dat.states.setCurPopout(
            <ActionSheet onClose={() => { dat.states.setCurPopout(null); }}>
                <ActionSheetItem onClick={editPost} autoclose>
                    <Text> Редактировать пост </Text>
                </ActionSheetItem>

                <ActionSheetItem onClick={queryDeletePost} autoclose mode="destructive">
                    <Text> Удалить пост </Text>
                </ActionSheetItem>

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
                <div className={s.parametrProgres}> <div /> <ProgressBar param="mood" value={mood} /> <div /> </div>
                <div className={s.parametrEmoji}> <div /> <img src={emojiMood} style={{ 'height': '24px', 'width': '24px' }} /> <div /> </div>

                <div className={s.parametrText}>
                    <div />
                    <Text weight='regular' style={{ 'fontSize': '85%' }}> Стресс </Text>
                    <div />
                </div>
                <div className={s.parametrProgres}> <div /> <ProgressBar param="stress" value={stress} /> <div /> </div>
                <div className={s.parametrEmoji}> <div /> <img src={emojiStress} style={{ 'height': '24px', 'width': '24px' }} /> <div /> </div>

                <div className={s.parametrText}>
                    <div />
                    <Text weight='regular' style={{ 'fontSize': '85%' }}> Тревожность </Text>
                    <div />
                </div>
                <div className={s.parametrProgres}> <div /> <ProgressBar param="anxiety" value={anxiety} /> <div /> </div>
                <div className={s.parametrEmoji}> <div /> <img src={emojiAnxiety} style={{ 'height': '24px', 'width': '24px' }} /> <div /> </div>
            </div>
        );
    };

    return (
        <Card size="l" mode="shadow" className={s.all}>
            <Cell className={s.reference} description={<Text> {dateField} </Text>}
                before={<Avatar size={40} src={userAva} />}
                asideContent={(user.id === currentUser.id) ?
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
            {updateDateField()}
        </Card>
    );
}

export default TextPost;

/*
 * <Cell className={s.reference} description={<Text> {dateField} </Text>}
                before={<Avatar size={40} src={userAva} />}
                asideContent={(user.id === currentUser.id) ?
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
            {updateDateField()}
 *
 *
 *
 */

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
