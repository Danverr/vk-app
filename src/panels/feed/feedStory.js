import React, { useState, useEffect } from 'react';

import {
    Panel, PanelHeader, View, PullToRefresh, PanelHeaderContext, List, Cell, PanelHeaderContent,
    CardGrid
} from '@vkontakte/vkui';

import TextPost from './components/TextPost/TextPost.js';

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import './feedStory.css'

const BasePost = {
    userId: "505643430",
    mood: "3",
    stress: "2",
    anxiety: "3",
    isPublic: "0",
    title: "Обычный день, чо",
    note: "у меня все хорошо, но скоро егэ!(хе)",
};

const renderData = (post) => {
    return <TextPost postData={post} />;
}

const localState = {
    currentMode: 'feed',
    needUpdate: 1,
    posts: null,
    renderFunc : null,

    setPosts(posts) {
        this.posts = posts;
    },

    setMode(mode) {
        this.currentMode = mode;
    },

    setNeedUpdate(value) {
        this.needUpdate = value;
    },

};

const deletePostFromList = (post) => {
    setDeleted(1);
    localState.posts.splice(localState.posts.findIndex((e) => { return e === post; }), 1);
    localState.renderFunc(null);
    localState.renderFunc(localState.posts.map(renderData));
};

const addPostToList = (post) => {
    setDeleted(0);
    localState.posts.push(post);
    localState.posts.sort((left, right) => {
        const l = new Date(left.post.date);
        const r = new Date(right.post.date);
        return ((l < r) ? 1 : (l > r) ? -1 : 0);
    });
    localState.renderFunc(null);
    localState.renderFunc(localState.posts.map(renderData));
};

const setDeleted = (val) => {
    localState.deleted = val;
};

const Feed = (props) => {
    const [curPopout, setCurPopout] = useState(null);
    const [fetching, setFetching] = useState(null);
    const [wasUpdated, setWasUpdated] = useState(null);
    const [contextOpened, setContextOpened] = useState(null);
    const [mode, setMode] = useState(localState.currentMode);
    const [postWasDeleted, setPostWasDeleted] = useState(null);
    const [displayPosts, setDisplayPosts] = useState(null);

    useEffect(() => {
        localState.renderFunc = setDisplayPosts;
        props.state.fetchFriendsInfo();
    }, [props.state.userInfo, props.state.userToken]);

    useEffect(() => {
        props.state.fetchEntries();
    }, [props.state.friendsInfo, mode, wasUpdated]);

    useEffect(() => {
        if (!props.state.entries) return;

        if (!localState.needUpdate) {
            for (const i of localState.posts) {
                i.setCurPopout = setCurPopout;
                i.setPostWasDeleted = setPostWasDeleted;
                i.checkPopout = checkPopout;
            }
            setDisplayPosts(localState.posts.map(renderData));
            return;
        }

        //props.state.createEntry(BasePost);
        localState.setNeedUpdate(0);

        const newPosts = [];
        props.state.entries.map((e, i) => {
            if (mode === "feed" || (mode === "diary" && e.user === props.state.userInfo)) {
                newPosts.push({
                    ...e,
                    setCurPopout: setCurPopout,
                    setPostWasDeleted: setPostWasDeleted,
                    deletePostFromList: deletePostFromList,
                    addPostToList: addPostToList,
                    deletePostFromBase: props.state.deleteEntry,
                    addPostToBase: props.state.createEntry,
                    setDeleted: setDeleted,
                    checkPopout: checkPopout
                });
            }
        });

        localState.setPosts(newPosts);
        setDisplayPosts(newPosts.map(renderData));
        setFetching(null);
    }, [props.state.entries]);

    const checkPopout = () => {
        if (localState.deleted) {
            setPostWasDeleted(null);
            setDeleted(0);
        }
    };

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    const select = (e) => {
        if (e === mode) {
            toggleContext();
            return;
        }
        localState.setMode(e);
        localState.setNeedUpdate(1);
        setDisplayPosts(null);
        setMode(e);
        toggleContext();
    };

    const toggleRefresh = () => {
        setDisplayPosts(null);
        localState.setNeedUpdate(1);
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
                <PullToRefresh onRefresh={toggleRefresh} isFetching={fetching}>
                    <CardGrid className="grid">
                        {displayPosts}
                    </CardGrid>
                </PullToRefresh>
                {postWasDeleted}
            </Panel>
        </View>
    )


}

export default Feed;

/*
 *  <button onClick={toggleRefresh}> Обновить страничку (кнопка для дебага) </button>
 */
