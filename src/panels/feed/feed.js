
import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, Group, Spinner } from '@vkontakte/vkui';
import s from './Feed.module.css'
import TextPost from './components/TextPost/TextPost.js';
import api from '../../utils/api'
import PullToRefresh from '@vkontakte/vkui/dist/components/PullToRefresh/PullToRefresh';

const Feed = (props) => {
    const [usersInfo, setUsersInfo] = useState(0);
    const [wasUpdated, setWasUpdated] = useState(0);
    const [usersPosts, setUsersPosts] = useState(wasUpdated); //  присваеваем значение хука другому хуку, чтобы лента грузилась сразу
    const [posts, setPosts] = useState(0);

    const Spinner = true;

    useEffect(() => {
        if (wasUpdated === null || props.user == null) return;

        setPosts(<Spinner size="large" style={{ marginTop: 20 }} />);

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

    },
        [wasUpdated]
    );

    useEffect(() => {
        const temp = [];

        if (usersPosts != null && props.user != null && props.user.length == usersPosts.length) {
         //   debugger;
            props.user.map((user, i) => {
                usersPosts[i].data.map(post => {
                    const obj = { user: user, post: post };
                    if (post.isPublic === "1" || user.id === props.user.id) {
                        temp.push(<TextPost postData={obj} />);
                    }
                })
            })
        }
        setPosts(temp);
    },
        [usersPosts]
    );


    const onRefresh = () => {
        setWasUpdated(1);
    };

    return (
        <Panel id='Feed'>
            <PanelHeader separator={false}>
                Лента
        </PanelHeader>
            <Group className={s.content}>
                <button onClick={onRefresh}> Update Feed </button>
                {posts}
            </Group>
        </Panel>
    );
}

export default Feed;
