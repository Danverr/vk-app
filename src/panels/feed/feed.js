
import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, Group, Spinner, View, ActionSheet, ActionSheetItem } from '@vkontakte/vkui';
import s from './Feed.module.css'
import TextPost from './components/TextPost/TextPost.js';
import api from '../../utils/api'
import PullToRefresh from '@vkontakte/vkui/dist/components/PullToRefresh/PullToRefresh';
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
                note: "аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа",
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

//        createPost();

    },
        [wasUpdated]
    );

    useEffect(() => {
        if (props.user === null) return;
        if (props.user.length != usersPosts.length) return;
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

    const deletePost = async () => {
        setPosts(<Spinner size="large" style={{ marginTop: 20 }} />);
        var query = await api("DELETE", "/entries/", { entryId: lastPost.entryId });
        for (var i = 0; i < allPostsArray.length; ++i) {
            if (allPostsArray[i].post.entryId === lastPost.entryId) {
                allPostsArray.splice(i, 1);
                break;
            }
        }
        const temp = new Array();
        for (var key in allPostsArray) {
            temp.push(<TextPost postData={allPostsArray[key]} />);
        }
        setPosts(temp);
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
