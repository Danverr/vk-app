import React, { useState } from 'react';
import {
    Cell,
    Avatar,
    Card,
    Text,
    Headline,
    ActionSheet,
    ActionSheetItem,
    Alert,
    Caption,
    ScreenSpinner,
    Tooltip
} from '@vkontakte/vkui';
import s from './textPost.module.css';
import { platform, IOS } from '@vkontakte/vkui';

import Icon24MoreVertical from '@vkontakte/icons/dist/24/more_vertical';
import Icon12Lock from '@vkontakte/icons/dist/12/lock';

import moment from 'moment';
import ProgressBar from '../progressBar/progressBar'
import emojiList from "../../utils/getEmoji";
import DeleteSnackbar from '../deleteSnackbar/deleteSnackbar'
import getDateDescription from '../../utils/chrono';
import ErrorSnackbar from '../errorSnackbar/errorSnackbar';
import entryWrapper from '../entryWrapper';
import DoneSnackbar from '../doneSnackbar/doneSnackbar';

const TextPost = (props) => {
    const [upd, setUpd] = useState(1);

    const postData = props.postData;

    const user = postData.user;
    const title = postData.post.title ? String(postData.post.title) : null;
    const note = postData.post.note ? String(postData.post.note) : null;
    const currentUser = postData.currentUser;

    const entryId = postData.post.entryId;
    const avatar = user.photo_100;

    const mood = postData.post.mood;
    const stress = postData.post.stress;
    const anxiety = postData.post.anxiety;

    const emojiMood = postData.post.mood ? emojiList.mood[Math.round(postData.post.mood) - 1] : emojiList.placeholder;
    const emojiStress = postData.post.stress ? emojiList.stress[Math.round(postData.post.stress) - 1] : emojiList.placeholder;
    const emojiAnxiety = postData.post.anxiety ? emojiList.anxiety[Math.round(postData.post.anxiety) - 1] : emojiList.placeholder;

    const iHaveToolTip = () => {
        if (!postData.wrapper || !postData.wrapper.currentToolTip)
            return 0;
        const g = postData.wrapper.currentToolTip;
        if (g === -1)
            return 0;
        if (g[0] !== 0 || g[1] !== entryId)
            return 0;
        return 1;
    }

    let showTool = iHaveToolTip();

    let [tool, setTool] = useState(showTool);

    if (postData.wrapper && postData.wrapper.rerenderTP) {
        postData.wrapper.rerenderTP[entryId] = setTool;
    }

    const isMyPost = (currentUser && currentUser.id === user.id);

    const postDate = moment.utc(postData.post.date);
    const dateField = getDateDescription(postDate.local(), moment())[0];

    const recursion = () => {
        const shift = getDateDescription(postDate.local(), moment())[1];
        setTimeout(() => {
            setUpd(!upd);
        }, shift);
    };

    const editPost = () => {
        postData.setUpdatingEntryData({ ...postData.post, date: postDate });
        postData.nav.goTo("checkIn");
    };

    const reportPost = async () => {
        postData.setPopout(<ScreenSpinner />);
        try {
            await entryWrapper.postComplaint(entryId);
            postData.setPopout(null);
            postData.setSnackField(<DoneSnackbar onClose={() => {
                postData.setSnackField(null)
            }} text="Успешно" />);
        } catch (error) {
            postData.setPopout(null);
            postData.setSnackField(<ErrorSnackbar onClose={() => {
                postData.setSnackField(null)
            }} />)
        }
    }

    const deletePost = async () => {
        postData.setPopout(<ScreenSpinner />);
        try {
            await entryWrapper.deleteEntryFromBase(entryId);
            postData.wrapper.deleteEntryFromList(entryId);
            if (postData.deleteEntryFromFeedList) {
                postData.deleteEntryFromFeedList(entryId);
            }
            postData.setDisplayEntries(postData.wrapper.entries);
            postData.setPopout(null);
            postData.setSnackField(<DeleteSnackbar onClose={postData.setSnackField} />)
        } catch (error) {
            postData.setPopout(null);
            postData.setSnackField(<ErrorSnackbar onClose={() => {
                postData.setSnackField(null)
            }} />);
        }
    };

    const confirm = (text, action) => {
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
                        action: action
                    }]
                }
                onClose={() => {
                    postData.setPopout(null);
                }}
            >
                <h2> Подтверждение </h2>
                <p> {text} </p>
            </Alert>
        );
    }

    const onSettingClick = () => {
        if (postData.wrapper.currentToolTip && postData.wrapper.currentToolTip !== -1) return;
        postData.setSnackField(null);
        postData.setPopout(
            <ActionSheet onClose={() => {
                postData.setPopout(null);
            }}>
                {isMyPost && <ActionSheetItem onClick={editPost} autoclose>
                    Редактировать запись
                </ActionSheetItem>}

                {!isMyPost && <ActionSheetItem autoclose
                    onClick={() => {
                        confirm("Вы действительно хотите пожаловаться на этого пользователя?", reportPost)
                    }}>
                    Пожаловаться
                </ActionSheetItem>}

                {isMyPost &&
                    <ActionSheetItem
                        onClick={() => {
                            confirm("Вы действительно хотите удалить эту запись?", deletePost)
                        }} autoclose mode="destructive">
                        Удалить запись
                </ActionSheetItem>}

                {platform() === IOS && <ActionSheetItem autoclose mode="cancel"> Отменить </ActionSheetItem>}
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
                    <div><ProgressBar param="mood" value={mood * 20} /></div>
                    <div><ProgressBar param="anxiety" value={anxiety * 20} /></div>
                    <div><ProgressBar param="stress" value={stress * 20} /></div>
                </div>

                <div>
                    <img src={emojiMood} alt="" />
                    <img src={emojiAnxiety} alt="" />
                    <img src={emojiStress} alt="" />
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
                <div className={s.lockIcon}> {(isMyPost && !postData.post.isPublic) && <Icon12Lock />}</div>
            </>;
        }

        return null;
    };

    const renderText = (s, i) => {
        if (s === '\n')
            return <br key={i} />
        return <React.Fragment key={i}>
            {s}
        </React.Fragment>
    }

    const postText = () => {
        const titleNode = !title || title.length === 0 ? null :
            <Headline weight='medium'>{title.split('').map(renderText)}</Headline>;

        const noteNode = !note || note.length === 0 ? null :
            <Text weight='regular'>  {note.split('').map(renderText)} </Text>;

        return noteNode || titleNode ? <div className={s.postText}>{titleNode}{noteNode}</div> : null;
    };

    return (
        <Card size="l" mode="shadow" className="TextPost" onClick={props.onClick}>
            <Tooltip
                offsetX={-6}
                offsetY={6}
                isShown={tool}
                onClose={() => {
                    if (!iHaveToolTip()) return;
                    setTool(0);
                    document.body.style.overflow = 'visible';
                    postData.wrapper.currentToolTip = -1;
                    postData.wrapper.setCurrentScroll()
                    postData.wrapper.goNextToolTip()
                }}
                header={isMyPost ? "А вот и ваша запись!" : "У друга плохое самочувствие!"}
                text={isMyPost ? "Включите уведомление об опросе в настройках" : "Включите уведомление о низких показателях друга в настройках"}
            >
                <Cell
                    description={description()}
                    before={<Avatar size={48} src={avatar} />}
                    asideContent={currentUser && <Icon24MoreVertical onClick={onSettingClick} className={s.settingIcon} />}>
                    {`${user.first_name} ${user.last_name}`}
                </Cell>
            </Tooltip>

            {postText()}
            {parametrField()}
            {recursion()}
        </Card>
    )
}

export default TextPost;
