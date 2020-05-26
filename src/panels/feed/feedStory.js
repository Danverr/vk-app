
import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, Group, Spinner, View, ActionSheet, ActionSheetItem, } from '@vkontakte/vkui';
import s from './Feed.module.css'
import TextPost from './components/TextPost/TextPost.js';
import DeleteBar from './components/DeleteBar/DeleteBar.js'
import api from '../../utils/api'
import { Array } from 'core-js';

import { platform, IOS } from '@vkontakte/vkui';

const Feed = (props) => {
    const [usersInfo, setUsersInfo] = useState(0);
    const [wasUpdated, setWasUpdated] = useState(0);
    const [usersPosts, setUsersPosts] = useState(wasUpdated);
    const [posts, setPosts] = useState(<Spinner size="large" style={{ marginTop: 20 }} />);
    const [curPopout, setCurPopout] = useState(0);
    const osname = platform();

    var lastPost;
    var allPostsArray = new Array();

    useEffect(() => {
        if (wasUpdated === null || props.user === null) return;
        setPosts(<Spinner size="large" style={{ marginTop: 20 }} />);

        // Эта функция здесь для дебага
        const createPost = () => {
            api("POST", "/entries/", {
                userId: "505643430",
                mood: "3",
                stress: "2",
                anxiety: "3",
                isPublic: "1",
                title: "стандарт, порешал кф, поделал приложуху",
                note: "грустный день",
            });
        };

        const fetchUsersPosts = async () => {
            const temp = new Array();
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

        //createPost();

    },
        [wasUpdated]
    );

    useEffect(() => {
        if (props.user === null) return;
        if (props.user.length !== usersPosts.length) return;
        if (usersPosts === null) return;

        const temp = new Array();
        allPostsArray.length = 0;
        props.user.map((user, i) => {
            usersPosts[i].data.map((post, j) => {
                const obj = { user: user, post: post, currentUser: props.user[0], func: changePopout };
                if (post.isPublic === "1" || user.id === props.user[0].id) {
                    temp.push(<TextPost postData={obj} />);
                    allPostsArray.push(obj);
                }
            })
        })

        setPosts(temp);
    },
        [usersPosts]
    );

    const onRefresh = () => {
        setWasUpdated(!wasUpdated);
    };

    const reconstruction = () => {
        setPosts(<Spinner size="large" style={{ marginTop: 20 }} />);
        for (var i in allPostsArray) {
            if (allPostsArray[i].post.entryId === lastPost.entryId) {
                allPostsArray[i].wasDeleted = 0;
            }
        }
        const temp = new Array();
        for (var key in allPostsArray) {
            if (allPostsArray[key].wasDeleted === 1) continue;
            temp.push(<TextPost postData={allPostsArray[key]} />);
        }
        setCurPopout(null);
        setPosts(temp);
    };

    const finallyDelete = async () => {
        var query = await api("DELETE", "/entries/", { entryId: lastPost.entryId });
    }

    const goDeletePost = () => {
        setCurPopout(null);
        finallyDelete();
    }

    const afterDelete = () => {
        setCurPopout(<DeleteBar goDeletePost={goDeletePost} reconstruction={reconstruction}/> );
    }

    const deletePost = async () => {
        setPosts(<Spinner size="large" style={{ marginTop: 20 }} />);
        for (var i in allPostsArray) {
            if (allPostsArray[i].post.entryId === lastPost.entryId) {
                allPostsArray[i].wasDeleted = 1;
            }
        }
        const temp = new Array();
        for (var key in allPostsArray) {
            if (allPostsArray[key].wasDeleted === 1) continue;
            temp.push(<TextPost postData={allPostsArray[key]} />);
        }
        setPosts(temp);
        afterDelete();
    }

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
        <View popout={curPopout} activePanel='Feed'>
            <Panel id='Feed'>
                <PanelHeader separator={false}>
                    Лента
        </PanelHeader>
                <Group className={s.content}>
                    <button onClick={onRefresh}> Update Feed </button>
                    {posts}
                </Group>
            </Panel>
        </View>
    );
}

export default Feed;
