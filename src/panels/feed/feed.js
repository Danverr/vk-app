
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


const Feed = ({ id, fetchedUser }) => {
  const [usersInfo, setUsersInfo] = useState(null);
  const [wasUpdated, setWasUpdated] = useState(null);
  const [isFetch, setFetch] = useState(false);

  useEffect(() => {
    if (wasUpdated === null) return;
    const fetchUserInfo = async () => {
      const Promise = await api("GET", "/entries/", { userId: 281105343 });
      setUsersInfo(Promise.data);
    }
    fetchUserInfo();
  },
    [wasUpdated]
  );

  const onRefresh = () => {
    setFetch(true);
    setWasUpdated(1);
    setFetch(false);
  };

  return (
    <Panel id='Feed'>
      <PanelHeader separator={false}>
        Лента
        </PanelHeader>
      <Group className={s.content}>
        <button onClick={onRefresh}> Update Feed </button>
          {(usersInfo != null) ? (usersInfo.map((n, i) => (<TextPost user={user} text={n.note} description={n.title} date= {{day: getDate(new Date(n.date)), month: getMonth(new Date(n.date)), hour: getHours(new Date(n.date)), minute: getMinutes(new Date(n.date))}} />))) : null}
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