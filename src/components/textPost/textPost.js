import React, {useState} from 'react';
import {Cell, Avatar, Card, Text, Headline, ActionSheet, ActionSheetItem, Alert, Caption} from '@vkontakte/vkui';
import s from './textPost.module.css';
import {platform, IOS} from '@vkontakte/vkui';

import Icon24MoreVertical from '@vkontakte/icons/dist/24/more_vertical';
import Icon12Lock from '@vkontakte/icons/dist/12/lock';

import moment from 'moment';
import ProgressBar from '../progressBar/progressBar'
import emojiList from "../../utils/getEmoji";
import DeleteSnackbar from '../deleteSnackbar/deleteSnackbar'
import getDateDescription from '../../utils/chrono';
import entryWrapper from '../entryWrapper'

const TextPost = (props) => {
    const postData = props.postData;

    const user = postData.user;
    const title = postData.post.title;
    const note = postData.post.note;
    const currentUser = postData.currentUser;

    const avatar = user.photo_100;

    const mood = postData.post.mood * 20;
    const stress = postData.post.stress * 20;
    const anxiety = postData.post.anxiety * 20;

    const emojiMood = postData.post.mood ? emojiList.mood[Math.round(postData.post.mood) - 1] : emojiList.placeholder;
    const emojiStress = postData.post.stress ? emojiList.stress[Math.round(postData.post.stress) - 1] : emojiList.placeholder;
    const emojiAnxiety = postData.post.anxiety ? emojiList.anxiety[Math.round(postData.post.anxiety) - 1] : emojiList.placeholder;

    const postDate = moment.utc(postData.post.date);

    const [dateField] = useState(getDateDescription(postDate.local(), moment()));

    const editPost = () => {
        entryWrapper.editFunction = () => {
            postData.wrapper.deleteEntryFromList(postData);
        }
        postData.setUpdatingEntryData({...postData.post, date: postDate});
        if (postData.deleteEntryFromFeedList) {
            postData.deleteEntryFromFeedList(postData);
        }
        postData.nav.goTo("checkIn");
    };

    const deletePost = () => {
        postData.wrapper.deleteEntryFromBase(postData);
        postData.wrapper.deleteEntryFromList(postData);
        if (postData.deleteEntryFromFeedList) {
            postData.deleteEntryFromFeedList(postData);
        }
        postData.setDisplayEntries(postData.wrapper.entries);
        postData.setDeletedEntryField(<DeleteSnackbar onClose={postData.setDeletedEntryField}/>)
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
                onClose={() => {
                    postData.setPopout(null);
                }}
            >
                <h2><Text> Подтверждение </Text></h2>
                <p><Text> Вы действительно хотите удалить эту запись? </Text></p>
            </Alert>
        );
    }

    const onSettingClick = () => {
        postData.setDeletedEntryField(null);
        postData.setPopout(
            <ActionSheet onClose={() => {
                postData.setPopout(null);
            }}>
                <ActionSheetItem onClick={editPost} autoclose>
                    <Text> Редактировать запись </Text>
                </ActionSheetItem>

                <ActionSheetItem onClick={queryDeletePost} autoclose mode="destructive">
                    <Text> Удалить запись </Text>
                </ActionSheetItem>

                {platform() === IOS &&
                <ActionSheetItem autoclose mode="cancel"> <Text> Отменить </Text> </ActionSheetItem>}
            </ActionSheet>);
    }

    const parametrField = () => {
        return (
            <div className={s.paramsTable}>
                <div>
                    <Caption level="2" weight='regular'> Настроение </Caption>
                    <Caption level="2" weight='regular'> Тревожность </Caption>
                    <Caption level="2" weight='regular'> Стресс </Caption>
                </div>

                <div className={s.progressBarsCol}>
                    <div><ProgressBar param="mood" value={mood}/></div>
                    <div><ProgressBar param="anxiety" value={anxiety}/></div>
                    <div><ProgressBar param="stress" value={stress}/></div>
                </div>

                <div>
                    <img src={emojiMood} alt=""/>
                    <img src={emojiAnxiety} alt=""/>
                    <img src={emojiStress} alt=""/>
                </div>
            </div>
        );
    };

    const description = () => {
        if (postData.post.description) {
            return postData.post.description;
        }

        if (postData.post.date) {
            return <>
                {dateField}
                <div className={s.lockIcon}> {postData.post.isPublic ? null : <Icon12Lock/>}</div>
            </>;
        }

        return null;
    };

    const postText = () => {
        const titleNode = !title || title.length === 0 ? null : <Headline weight='medium'>{title}</Headline>;
        const noteNode = !note || note.length === 0 ? null : <Text weight='regular'>{note}</Text>;

        return noteNode || titleNode ? <div className={s.postText}>{titleNode}{noteNode}</div> : null;
    };

    return (
        <Card size="l" mode="shadow" className="TextPost" onClick={props.onClick}>
            <Cell
                description={description()}
                before={<Avatar size={48} src={avatar}/>}
                asideContent={(currentUser && user.id === currentUser.id) ?
                    <Icon24MoreVertical onClick={onSettingClick} className={s.settingIcon}/> : null}>
                {`${user.first_name} ${user.last_name}`}
            </Cell>

            {postText()}
            {parametrField()}
        </Card>
    )
}

export default TextPost;