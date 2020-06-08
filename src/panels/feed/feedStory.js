import React, { useState, useEffect } from 'react';

import {
    Panel, PanelHeader, Group, Spinner, View, ActionSheet, ActionSheetItem,
    PullToRefresh, PanelHeaderContext, List, Cell, PanelHeaderContent, Snackbar
} from '@vkontakte/vkui';

import s from './Feed.module.css'
import TextPost from './components/TextPost/TextPost.js';

import DeleteBar from './components/DeleteBar/DeleteBar.js';

import api from '../../utils/api'
import { Array } from 'core-js';

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

import { platform, IOS } from '@vkontakte/vkui';

const osname = platform();

const Feed = (props) => {
    const [usersPosts, setUsersPosts] = useState(null);
    const [posts, setPosts] = useState(null);
    const [curPopout, setCurPopout] = useState(null);
    const [fetching, setFetching] = useState(null);
    const [contextOpened, setContextOpened] = useState(null);
    const [mode, setMode] = useState('feed');
    const [postWasDeleted, setPostWasDeleted] = useState(null);
    const [lastPost, setLastPost] = useState(null);
    const [allPostsArray, setAllPostsArray] = useState(null);

    useEffect(() => {
        props.state.fetchFriendsInfo();
    }, [props.state.userInfo, props.state.userToken]);

    useEffect(() => {
        props.state.fetchEntries();
    }, [props.state.friendsInfo, mode, fetching]);

    useEffect(() => {
        if (!props.state.entries || !props.state.usersInfo || props.state.usersInfo.length !== props.state.entries.length) return;
        const temp = [];
        const vita = [];
        props.state.usersInfo.map((user, i) => {
            if ((mode == 'feed') || (mode == 'diary' && user === props.state.userInfo)) {
                props.state.entries[i].data.map((post, j) => {
                    const obj = {
                        user: user, post: post, currentUser: props.state.usersInfo[0], func: changeLastPost,
                    }
                    temp.push(<TextPost postData={obj} />);
                    vita.push(obj);
                });
            }
        });
        setAllPostsArray(vita);
        setPosts(temp);
    }, [props.state.entries]);

    useEffect(() => {
        if (!lastPost) return;
        debugger;
        setCurPopout(<ActionSheet onClose={() => { setCurPopout(null); }}>
            <ActionSheetItem onClick={() => { alert("YES!") }} autoclose>
                Редактировать пост
                </ActionSheetItem>
            <ActionSheetItem /*onClick={deletePost}*/ autoclose mode="destructive">
                Удалить пост
                </ActionSheetItem>
            {osname === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
        </ActionSheet>);
    }, [lastPost]);

    const changeLastPost = (post) => {
        debugger;


        if (!lastPost) {
            setLastPost({ flag: 0, post: post });
        } else {
            setLastPost({ flag: !lastPost.flag, post: post })
        }


    }

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    const select = (e) => {
        const nextMode = e.currentTarget.dataset.mode;
        setPosts(null);
        setMode(nextMode);
        toggleContext();
    };

    const onRefresh = () => {
        setFetching(1);
        setTimeout(() => { setFetching(null) }, 1000);
    };

    return (
        <View popout={curPopout}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id='main'>
                {console.log(lastPost)}
                <PanelHeader separator={false}>
                    <PanelHeaderContent onClick={toggleContext} aside={<Icon16Dropdown style={{ transform: `rotate(${contextOpened ? '180deg' : '0'})` }} />}>
                        {mode === "feed" ? 'Лента' : 'Мой дневник'}
                    </PanelHeaderContent>
                </PanelHeader>
                <PanelHeaderContext opened={contextOpened} onClose={toggleContext} >
                    <List>
                        <Cell before={<Icon28Newsfeed />} data-mode='feed' onClick={select} asideContent={mode === "feed" ? <Icon24Done fill="var(--accent)" /> : null}>
                            Лента
                        </Cell>
                        <Cell before={<Icon28ListOutline />} data-mode='diary' onClick={select} asideContent={mode === "diary" ? <Icon24Done fill="var(--accent)" /> : null}>
                            Мой дневник
                        </Cell>
                    </List>
                </PanelHeaderContext>
                <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                    {posts}
                </PullToRefresh>
            </Panel>
        </View>
    )


}

export default Feed;