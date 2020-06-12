import React, { useState, useEffect } from 'react';

import {
    Panel, PanelHeader, Group, Spinner, View, ActionSheet, ActionSheetItem,
    PullToRefresh, PanelHeaderContext, List, Cell, PanelHeaderContent, Snackbar, Text
} from '@vkontakte/vkui';

import s from './feedStory.module.css'
import TextPost from './components/TextPost/TextPost.js';

import DeleteBar from './components/DeleteBar/DeleteBar.js';

import api from '../../utils/api'

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

import { platform, IOS } from '@vkontakte/vkui';

const osname = platform();

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

const renderData = (post) => { return (!post.delete) ? < TextPost postData={post} /> : null }

const Action = (props) => {
    const deletePost = () => {
        const newPosts = [...props.posts];
        newPosts[newPosts.findIndex((obj) => (obj.post.entryId === props.lastPost.post.entryId))].delete = 1;
        props.setPosts(newPosts);
        props.setDisplayPosts(newPosts.map(renderData));
        props.setPostWasDeleted(<DeleteBar
            posts={props.posts}
            setPosts={props.setPosts}
            setDisplayPosts={props.setDisplayPosts}
            finallyDeletePost={props.finallyDeletePost}
            lastPost={props.lastPost}
            renderData={renderData}
            setLastPost={props.setLastPost}
            setPostWasDeleted={props.setPostWasDeleted}
        />)
    };

    return (
        <ActionSheet onClose={props.onClose} >
            <ActionSheetItem onClick={() => { alert("YES!") }} autoclose> <Text> Редактировать пост </Text> </ActionSheetItem>
            <ActionSheetItem onClick={deletePost} autoclose mode="destructive"> <Text> Удалить пост </Text>  </ActionSheetItem>
            {osname === IOS && <ActionSheetItem autoclose mode="cancel"> <Text> Отменить </Text> </ActionSheetItem>}
        </ActionSheet>
    );
}

const Feed = (props) => {
    const [posts, setPosts] = useState(null);
    const [curPopout, setCurPopout] = useState(null);
    const [fetching, setFetching] = useState(null);
    const [contextOpened, setContextOpened] = useState(null);
    const [mode, setMode] = useState('feed');
    const [postWasDeleted, setPostWasDeleted] = useState(null);
    const [displayPosts, setDisplayPosts] = useState(null);
    const [lastPost, setLastPost] = useState(null);

    useEffect(() => {
        props.state.fetchFriendsInfo();
    }, [props.state.userInfo, props.state.userToken]);

    useEffect(() => {
        props.state.fetchEntries();
    }, [props.state.friendsInfo, mode, fetching]);

    useEffect(() => {
        if (!props.state.entries) return;
        const newPosts = [];
        props.state.entries.map((e, i) => {
            if (mode === "feed" || (mode === "diary" && e.user === props.state.userInfo)) {
                const currentPost = Object.assign({}, e);
                currentPost.setLastPost = setLastPost;
                newPosts.push(currentPost);
            }
        });
        setPosts(newPosts);
        setDisplayPosts(newPosts.map(renderData));
    }, [props.state.entries]);

    useEffect(() => {
        if (!lastPost) return;
        if (postWasDeleted) {
            finallyDeletePost(postWasDeleted.props.lastPost);
            setPostWasDeleted(null);
        }
        setCurPopout(<Action
            onClose={() => { setCurPopout(null); }}
            posts={posts}
            setPosts={setPosts}
            setDisplayPosts={setDisplayPosts}
            lastPost={lastPost}
            setPostWasDeleted={setPostWasDeleted}
            finallyDeletePost={finallyDeletePost}
            setLastPost={setLastPost}
        />);
    }, [lastPost]);

    const finallyDeletePost = (post) => {
        if (!post) return;
        setPostWasDeleted(null);
        props.state.deleteEntrie(post.post.entryId);
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

    const onRefresh = () => {
        if (postWasDeleted) {
            setPostWasDeleted(null);
            finallyDeletePost(lastPost);
        }
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
                <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                    {displayPosts}
                </PullToRefresh>
                {postWasDeleted}
            </Panel>
        </View>
    )


}

export default Feed;