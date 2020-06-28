import React, { useState, useEffect } from 'react';

import {
    Panel, PanelHeader, View, PullToRefresh, PanelHeaderContext, List, Cell, PanelHeaderContent,
    CardGrid, Group, Spinner
} from '@vkontakte/vkui';

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import './feedStory.css'
import TextPost from '../../components/TextPost/TextPost.js';

import bridge from "@vkontakte/vk-bridge";
import api from '../../utils/api.js'

const renderData = (post) => {
    return <TextPost postData={post} />;
}

const state = {
    currentMode: 'feed',
    needUpdate: 1,
    entries: null,
    userInfo: null,
    userToken: null,
    friendsInfo: null,
    renderedEntries: null,

    setDeleted(val) {
        state.deleted = val;
    },

    setMode(mode) {
        state.currentMode = mode;
    },

    setNeedUpdate(value) {
        state.needUpdate = value;
    },

    setUserInfo(userInfo) {
        state.userInfo = userInfo;
    },

    setUserToken(userToken) {
        state.userToken = userToken;
    },

    deleteEntryFromBase(id) {
        return api("DELETE", "/entries/", { entryId: id });
    },

    addEntryToBase(post) {
        return api("POST", "/entries/", {
            entries: JSON.stringify(
                [post]),
        });
    },

    fetchFriendsInfoPromise() {
        api("GET", "/statAccess/", { type: 'fromId' }).then((result) => {
            bridge.send("VKWebAppCallAPIMethod", {
                method: "users.get",
                params: {
                    access_token: state.userToken,
                    v: "5.103",
                    user_ids: result.data.join(","),
                    fields: "photo_50, photo_100"
                }
            }).then((result) => {
                state.friendsInfo = result.response;
                state.fetchEntries();
            });
        });
    },

    fetchEntriesPromise() {
        api("GET", "/entries/all", { skip: 0, count: 100 }).then((result) => {
            state.entries = result.data;
            state.fetchEntries();
        });
    },

    fetchEntries() {
        if (!state.entries || !state.friendsInfo) return;

        const usersMap = {};
        usersMap[state.userInfo.id] = state.userInfo;

        state.friendsInfo.map((friend) => {
            usersMap[friend.id] = friend;
        });

        state.renderedEntries = [];

        const now = new Date();

        state.entries.map((entry) => {
            if (state.currentMode === 'feed' || (entry.userId === state.userInfo.id)) {
                const obj = {
                    post: entry,
                    user: usersMap[entry.userId],
                    currentUser: state.userInfo,

                    setCurPopout: state.setCurPopout,
                    setPostWasDeleted: state.setPostWasDeleted,
                    checkPopout: state.checkPopout,

                    deletePostFromList: state.deleteEntryFromList,
                    addPostToList: state.addEntryToList,

                    deletePostFromBase: state.deleteEntryFromBase,
                    addPostToBase: state.addEntryToBase,

                    setDeleted: state.setDeleted,
                };
                state.renderedEntries.push(obj);
            }
        });

        state.setFetching(0);
        state.setDisplayEntries(state.renderedEntries.map(renderData));
    },

    updateState(setCurPopout, setPostWasDeleted, checkPopout, setDisplayEntries, setFetching) {
        state.friendsInfo = null;
        state.entries = null;
        
        state.setFetching = setFetching;
        state.setCurPopout = setCurPopout;
        state.setPostWasDeleted = setPostWasDeleted;
        state.checkPopout = checkPopout;
        state.setDisplayEntries = setDisplayEntries;

        state.fetchFriendsInfoPromise();
        state.fetchEntriesPromise();
    },

    deleteEntryFromList(post) {
        state.setDeleted(1);
        state.renderedEntries.splice(state.renderedEntries.findIndex((e) => { return e === post; }), 1);
        state.setDisplayEntries(null);
        state.setDisplayEntries(state.renderedEntries.map(renderData));
    },

    addEntryToList(post) {
        state.setDeleted(0);
        state.renderedEntries.push(post);
        state.renderedEntries.sort((left, right) => {
            const l = new Date(left.post.date);
            const r = new Date(right.post.date);
            return ((l < r) ? 1 : (l > r) ? -1 : 0);
        });
        state.setDisplayEntries(null);
        state.setDisplayEntries(state.renderedEntries.map(renderData));
    },

};

const Feed = (props) => {
    const [curPopout, setCurPopout] = useState(null);
    const [fetching, setFetching] = useState(null);
    const [wasUpdated, setWasUpdated] = useState(null);
    const [contextOpened, setContextOpened] = useState(null);
    const [mode, setMode] = useState(state.currentMode);
    const [postWasDeleted, setPostWasDeleted] = useState(null);
    const [displayEntries, setDisplayEntries] = useState((state.renderedEntries) ? null : < Spinner size= 'large' />);

    useEffect(() => {
        if (!state.needUpdate) return;
        if (!props.state.userInfo && !state.userInfo) return;
        if (!props.state.userToken && !state.userToken) return;

        if (!state.userInfo) {
            state.setUserInfo(props.state.userInfo);
        }

        if (!state.userToken) {
            state.setUserToken(props.state.userToken);
        }

        state.setNeedUpdate(0);
        state.updateState(setCurPopout, setPostWasDeleted, checkPopout, setDisplayEntries, setFetching);
    }, [wasUpdated, mode, props.state.userInfo, props.state.userToken]);


    const checkPopout = () => {
        if (state.deleted) {
            setPostWasDeleted(null);
            state.setDeleted(0);
        }
    };

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    const select = (e) => {
        if (e === mode) { toggleContext(); return; }
        setDisplayEntries(<Spinner size='large' />);
        state.setMode(e);
        state.setNeedUpdate(1);
        setMode(e);
        toggleContext();
    };

    const toggleRefresh = () => {
        setFetching(1);
        state.setNeedUpdate(1);
        setWasUpdated(!wasUpdated);
    };

    return (
        <View
            id={props.id}
            popout={curPopout}
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
                        {
                            (displayEntries) ? displayEntries :
                                (state.renderedEntries) ?
                                    state.renderedEntries.map((item) => {
                                        item.setCurPopout = setCurPopout;
                                        item.setPostWasDeleted = setPostWasDeleted;
                                        item.checkPopout = checkPopout;
                                        return <TextPost postData={item} />
                                    }) :   null
                        }
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
