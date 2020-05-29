import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, Group, Spinner, View, ActionSheet, ActionSheetItem, PullToRefresh } from '@vkontakte/vkui';
import s from './Feed.module.css'
import TextPost from './components/TextPost/TextPost.js';
import DeleteBar from './components/DeleteBar/DeleteBar.js'
import api from '../../utils/api'
import { Array } from 'core-js';

import { platform, IOS } from '@vkontakte/vkui';

const Feed = (props) => {
    const [usersPosts, setUsersPosts] = useState(null);
    const [posts, setPosts] = useState(<Spinner size="regular" style={{ marginTop: 20 }} />);
    const [curPopout, setCurPopout] = useState(null);
    const [fetching, setFetching] = useState(null);

    const osname = platform();

    var lastPost;
    var allPostsArray = [];

    useEffect(() => {
        if (!props.user) return;

        // Эта функция здесь для дебага
        const createPost = () => {
            api("POST", "/entries/", {
                userId: "505643430",
                mood: "3",
                stress: "2",
                anxiety: "3",
                isPublic: "1",
                title: "ffffffffffffffffff",
                note: "Привет, Даня!",
            });
        };

        const fetchUsersPosts = async () => {
            const temp = [];
            const fetchUserPosts = async (promices) => {
                const results = await Promise.all(promices);
                setUsersPosts(results);
            }
            props.user.map(user => {
                temp.push(api("GET", "/entries/", { userId: user.id }));
            });
            fetchUserPosts(temp);
        }
        fetchUsersPosts();

   //    createPost();

    },
        [props.user, fetching]
    );

    useEffect(() => {

        if (!usersPosts) return;
        if (!props.user) return;
        if (props.user.length !== usersPosts.length) return;


        const temp = [];
        allPostsArray.length = 0;
        props.user.map((user, i) => {
            usersPosts[i].data.map((post, j) => {
                const obj = { user: user, post: post, currentUser: props.user[0], func: changePopout };
                temp.push(<TextPost postData={obj} />);
                allPostsArray.push(obj);
            })
        })

        setPosts(temp);
    },
        [usersPosts]
    );

    const onRefresh = () => {
        setFetching(1);
        setFetching(null);
    };

    const reconstruction = () => {
        setPosts(<Spinner size="large" style={{ marginTop: 20 }} />);
        for (var i in allPostsArray) {
            if (allPostsArray[i].post.entryId === lastPost.entryId) {
                allPostsArray[i].wasDeleted = 0;
            }
        }
        const temp = [];
        for (var key in allPostsArray) {
            if (allPostsArray[key].wasDeleted === 1) continue;
            temp.push(<TextPost postData={allPostsArray[key]} />);
        }
        setCurPopout(null);
        setPosts(temp);
    };

    const finallyDelete = () => {
        setCurPopout(null);
        api("DELETE", "/entries/", { entryId: lastPost.entryId });
    }

    const deletePost = () => {
        setPosts(<Spinner size="large" style={{ marginTop: 20 }} />);
        for (var i in allPostsArray) {
            if (allPostsArray[i].post.entryId === lastPost.entryId) {
                allPostsArray[i].wasDeleted = 1;
            }
        }
        const temp = [];
        for (var key in allPostsArray) {
            if (allPostsArray[key].wasDeleted === 1) continue;
            temp.push(<TextPost postData={allPostsArray[key]} />);
        }
        setPosts(temp);
        setCurPopout(<DeleteBar goDeletePost={finallyDelete} reconstruction={reconstruction} />);
    };

    const changePopout = (post) => {
        lastPost = post;
        setCurPopout(<ActionSheet onClose={() => { setCurPopout(null); }}>
            <ActionSheetItem onClick={() => { alert("YES!") }} autoclose>
                Редактировать пост
                </ActionSheetItem>
            <ActionSheetItem onClick={deletePost} autoclose mode="destructive">
                Удалить пост
                </ActionSheetItem>
            {osname === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
        </ActionSheet>);
    };

    return (
        <View popout={curPopout}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id='main'>
                <PanelHeader separator={false}>
                    Лента
        </PanelHeader>
                <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                    <Group className={s.content}>
                        {posts}
                    </Group>
                </PullToRefresh>
            </Panel>
        </View>
    );
}

export default Feed;