import React, { useState, useEffect } from 'react';

import {
    Panel, PanelHeader, View, ActionSheet, ActionSheetItem, PullToRefresh, PanelHeaderContext, List, Cell, PanelHeaderContent, Text
} from '@vkontakte/vkui';

import TextPost from './components/TextPost/TextPost.js';
import DeleteBar from './components/DeleteBar/DeleteBar.js';
import api from '../../utils/api'

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import './feedStory.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { platform, IOS } from '@vkontakte/vkui';

const createPost = async () => {
    api("POST", "/entries/", {
        userId: "505643430",
        mood: "5",
        stress: "1",
        anxiety: "1",
        isPublic: "1",
        title: "День норм",
        note: "",
    });
};

const localState = {};

const setPosts = (posts) => {
    localState.posts = posts;
}

const deletePost = (post) => {
    localState.posts[localState.posts.findIndex((e) => (e.post.entryId === localState.lastPost.entryId))].delete = 1;
}

const reconstructionPost = (post) => {
    localState.posts[localState.posts.findIndex((e) => (e.post.entryId === localState.lastPost.entryId))].delete = 0;
}

const osname = platform();
const renderData = (post) => {
    return (!post.delete) ?
        <TextPost postData={post} />
        : null
}

const Action = (props) => {
    return (
        <ActionSheet onClose={props.onClose} >
            <ActionSheetItem onClick={() => { alert("YES!") }} autoclose> <Text> Редактировать пост </Text> </ActionSheetItem>
            <ActionSheetItem onClick={props.prevDeletePost} autoclose mode="destructive"> <Text> Удалить пост </Text>  </ActionSheetItem>
            {osname === IOS && <ActionSheetItem autoclose mode="cancel"> <Text> Отменить </Text> </ActionSheetItem>}
        </ActionSheet>
    );
}

const Feed = (props) => {
    const [curPopout, setCurPopout] = useState(null);
    const [fetching, setFetching] = useState(null);
    const [wasUpdated, setWasUpdated] = useState(null);
    const [contextOpened, setContextOpened] = useState(null);
    const [mode, setMode] = useState('feed');
    const [postWasDeleted, setPostWasDeleted] = useState(null);
    const [displayPosts, setDisplayPosts] = useState(null);

    useEffect(() => {
        props.state.fetchFriendsInfo();
    }, [props.state.userInfo, props.state.userToken]);

    useEffect(() => {
        props.state.fetchEntries();
    }, [props.state.friendsInfo, mode, wasUpdated]);

    useEffect(() => {
        if (!props.state.entries) return;
        const newPosts = [];
        props.state.entries.map((e, i) => {
            if (mode === "feed" || (mode === "diary" && e.user === props.state.userInfo)) {
                const currentPost = { ...e, onSettingClick: onSettingClick };
                if (localState.postWasDeleted && currentPost.post.entryId === localState.lastPost.entryId) {
                    currentPost.delete = 1;
                }
                newPosts.push(currentPost);
            }
        });
        setPosts(newPosts);
        setDisplayPosts(newPosts.map(renderData));
        setFetching(null);
    }, [props.state.entries]);

    const reconstructionPostOnFeed = () => {
        localState.postWasDeleted = 0;
        reconstructionPost(localState.lastPost);
        setPostWasDeleted(null);
        setDisplayPosts(localState.posts.map(renderData));
    };

    const prevDeletePost = () => {
        localState.postWasDeleted = 1;
        deletePost(localState.lastPost);
        setPostWasDeleted(< DeleteBar
            reconstructionPostOnFeed={reconstructionPostOnFeed}
            finallyDeletePost={finallyDeletePost}
        />);
        setDisplayPosts(localState.posts.map(renderData));
    }

    const onSettingClick = (post) => {
        if (localState.postWasDeleted) {
            finallyDeletePost();
        }
        localState.lastPost = post;
        setCurPopout(<Action
            onClose={() => { setCurPopout(null); }}
            prevDeletePost={prevDeletePost}
        />);
    }

    const finallyDeletePost = () => {
        if (!localState.lastPost) return;
        localState.postWasDeleted = 0;
        setPostWasDeleted(null);
        props.state.deleteEntrie(localState.lastPost.entryId);
    };

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    const select = (e) => {
        if (e === mode) {
            toggleContext();
            return;
        }
        setDisplayPosts(null);
        setMode(e);
        toggleContext();
    };

    const toggleRefresh = () => {
        setFetching(1);
        setWasUpdated(!wasUpdated);
    };

    return (
        <View popout={curPopout}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id='main'>
                <PanelHeader separator={false}>
                    <PanelHeaderContent
                        onClick={toggleContext}
                        aside={<Icon16Dropdown style={{ transform: `rotate(${contextOpened ? '180deg' : '0'})` }} />}>
                        {mode === "feed" ? 'Лента' : 'Мой дневник'}
                    </PanelHeaderContent>
                </PanelHeader>
                <PanelHeaderContext opened={contextOpened} onClose={toggleContext} >
                    <List>
                        <Cell before={<Icon28Newsfeed />}
                            onClick={() => { select('feed') }}
                            asideContent={mode === "feed" ? <Icon24Done fill="var(--accent)" /> : null}>
                            Лента
                        </Cell>
                        <Cell before={<Icon28ListOutline />}
                            onClick={() => { select('diary') }}
                            asideContent={mode === "diary" ? <Icon24Done fill="var(--accent)" /> : null}>
                            Мой дневник
                        </Cell> 
                    </List>
                </PanelHeaderContext>
                {console.log("Я рендерюсь!")}
                <PullToRefresh onRefresh={toggleRefresh} isFetching={fetching}>

                    <ReactCSSTransitionGroup
                        transitionName="example"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {displayPosts}
                    </ReactCSSTransitionGroup>

                </PullToRefresh>
                {postWasDeleted}
            </Panel>
        </View>
    )


}

export default Feed;