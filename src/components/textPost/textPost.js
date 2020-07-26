

import React, { useState } from 'react';
import { Cell, Avatar, Card, Text, Subhead, ActionSheet, ActionSheetItem, Alert, Caption } from '@vkontakte/vkui';
import s from './textPost.module.css'

import Icon24MoreVertical from '@vkontakte/icons/dist/24/more_vertical';
import Icon12Lock from '@vkontakte/icons/dist/12/lock';

import { platform, IOS } from '@vkontakte/vkui';

import moment from 'moment';
import ProgressBar from '../ProgressBar/ProgressBar'
import emojiList from '../../assets/emoji/emojiList.js';
import DeleteBar from '../DeleteBar/DeleteBar'
import getDateDescription from '../../utils/chrono';
import entryWrapper from '../entryWrapper'

const TextPost = (props) => {
    const postData = props.postData;

    const user = postData.user;
    const title = postData.post.title;
    const note = postData.post.note;
    const currentUser = postData.currentUser;

    const avatar = user.photo_100;

    const mood = postData.post.mood;
    const stress = postData.post.stress;
    const anxiety = postData.post.anxiety;

    const emojiMood = emojiList.mood[mood - 1];
    const emojiStress = emojiList.stress[stress - 1];
    const emojiAnxiety = emojiList.anxiety[anxiety - 1];

    const postDate = moment.utc(postData.post.date);

    const [dateField, setDateField] = useState(getDateDescription(postDate.local(), moment()));

    const editPost = () => {
        entryWrapper.editingEntry = postData;
        postData.setUpdatingEntryData({ ...postData.post, date: postDate });
        if (postData.deleteEntryFromFeedList) {
            postData.deleteEntryFromFeedList(postData);
        }
        postData.nav.goTo("checkIn");
    };

    const deletePost = async () => {
        await postData.wrapper.deleteEntryFromBase(postData);
        postData.wrapper.deleteEntryFromList(postData);
        if (postData.deleteEntryFromFeedList) {
            postData.deleteEntryFromFeedList(postData);
        }
        postData.setDisplayEntries(postData.wrapper.entries);
        postData.setSnackField(<DeleteBar onClose={postData.setSnackField} />)
    };

    const queryDeletePost = () => {
        postData.setPopout(
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
                        action: deletePost
                    }]
                }
                onClose={() => { postData.setPopout(null); }}
            >
                <h2> Подтверждение  </h2>
                <p>  Вы действительно хотите удалить эту запись? </p>
            </Alert>
        );
    }

    const onSettingClick = () => {
        postData.setSnackField(null);
        postData.setPopout(
            <ActionSheet onClose={() => { postData.setPopout(null); }}>
                <ActionSheetItem onClick={editPost} autoclose>
                    Редактировать запись
                </ActionSheetItem>

                <ActionSheetItem onClick={queryDeletePost} autoclose mode="destructive">
                    Удалить запись
                </ActionSheetItem>

                {platform() === IOS && <ActionSheetItem autoclose mode="cancel">  Отменить  </ActionSheetItem>}
            </ActionSheet>);
    }

    const parametrField = () => {
        const style = {
            'color': 'var(--text_secondary)',
        };

        return <div className={s.parametresField}>
            <div className={s.parametrText}> <div /> <Caption level="2" weight='regular' style={style}> Настроение </Caption> <div /> </div>
            <div className={s.parametrProgress}> <div /> <ProgressBar param="mood" value={mood * 20} /> <div /> </div>
            <div className={s.parametrEmoji}> <div /> <img src={emojiMood} style={{ 'height': '24px', 'width': '24px' }} /> <div /> </div>

            <div className={s.parametrText}> <div /> <Caption level="2" weight='regular' style={style}> Тревожность </Caption> <div /> </div>
            <div className={s.parametrProgress}> <div /> <ProgressBar param="anxiety" value={anxiety * 20} /> <div /> </div>
            <div className={s.parametrEmoji}> <div /> <img src={emojiAnxiety} style={{ 'height': '24px', 'width': '24px' }} /> <div /> </div>

            <div className={s.parametrText}> <div /> <Caption level="2" weight='regular' style={style}> Стресс </Caption> <div /> </div>
            <div className={s.parametrProgress}> <div /> <ProgressBar param="stress" value={stress * 20} /> <div /> </div>
            <div className={s.parametrEmoji}> <div /> <img src={emojiStress} style={{ 'height': '24px', 'width': '24px' }} /> <div /> </div>
        </div>
    };

    const description = () => {
        return <div className={s.description}>
            {dateField}
            <div className={s.lockIcon}> {postData.post.isPublic ? null : <Icon12Lock />}  </div>
        </div>
    };

    return (
        <Card size="l" mode="shadow" className="TextPost">
            <Cell description={description()}
                before={<Avatar size={48} src={avatar} />}
                asideContent={(currentUser && user.id === currentUser.id) ?
                    <Icon24MoreVertical onClick={onSettingClick} className={s.settingIcon} /> : null}>
                {user.first_name} {user.last_name}
            </Cell>
            {
                (title || note) ? <div className={s.content}>
                    <Subhead weight='bold' className={s.title}>
                        {title}
                    </Subhead>
                    <Text weight='regular' className={s.note}>
                        {note}
                    </Text>
                </div> : null
            }
            {parametrField()}
        </Card>
    )
}

export default TextPost;

