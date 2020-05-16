
import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, Group } from '@vkontakte/vkui';
import s from './Feed.module.css'
import TextPost from './components/TextPost/TextPost.js';
import api from '../../utils/api'
import PullToRefresh from '@vkontakte/vkui/dist/components/PullToRefresh/PullToRefresh';


import { getDate, getMonth, getYear, getHours, getMinutes } from '@wojtekmaj/date-utils';

import ava from './ava.jpg';
import ava_danya from './danya.jpg'


const user = {
    photo_200: ava,
    first_name: 'Albert',
    last_name: 'Skalt'
};

const user2 = {
    photo_200: ava_danya,
    first_name: 'Даниил',
    last_name: 'Маряхин'
};

const date = {
    day: 28,
    month: 'Апреля',
    hour: 12,
    minute: 33,
};

/*
 * 
 *  <TextPost user={user} text='Я скажу то, что для тебя не новость: мир не такой уж солнечный и приветливый. Это очень опасное, жесткое место, и если только дашь слабину, он опрокинет с такой силой тебя, что больше уже не встанешь. Ни ты, ни я, никто на свете, не бьёт так сильно, как жизнь! Совсем не важно, как ты ударишь, а важно, какой держишь удар, как двигаешься вперёд. Будешь идти — ИДИ! Если с испугу не свернёшь... Только так побеждают! Если знаешь, чего ты стоишь — иди и бери своё! Но будь готов удары держать, а не забрасывай кф на 2 месяца ' description='обычный день' date={date}/>

        <TextPost user={user2} text='Годно! ' description='Солнечно' date={date}/>
 * 
 * 
 */


const Feed = (props) => {
    const [usersInfo, setUsersInfo] = useState(null);
    const [wasUpdated, setWasUpdated] = useState(null);
    const [usersPosts, setUsersPosts] = useState(null);
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        if (wasUpdated === null || props.user==null) return;

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
        if (usersPosts != null && props.user.length == usersPosts.length) {
            props.user.map((user, i) => {
                usersPosts[i].data.map(post => temp.push(
                    (<TextPost
                    user={{ photo_200: (user.photo_50 != null) ? user.photo_50 : user.photo_200, first_name: user.first_name, last_name: user.last_name }}
                    text={post.note}
                    description={post.title}
                    date={{ day: getDate(new Date(post.date)), month: getMonth(new Date(post.date)), hour: getHours(new Date(post.date)), minute: getMinutes(new Date(post.date)) }}
                />)))
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


/*
 *  {(usersInfo != null) ? (usersInfo.map((n, i) => (<TextPost user={user} text={n.note} description={n.title} date={date} />))) : null}
 *
 *
 *  <PullToRefresh onRefresh={onRefresh} isFetching={state.fetching}>
          {(usersInfo != null) ? (usersInfo.map((n, i) => (<TextPost user={user} text={n.note} description={n.title} date={date} />))) : null}
        </PullToRefresh>
 *
 */