
import React from 'react';
import {Panel, PanelHeader, Group } from '@vkontakte/vkui';
import s from './Feed.module.css'
import TextPost from './components/TextPost/TextPost.js';

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

const Feed = ({ id, fetchedUser }) => {
  return (
    <Panel id='Feed'>
      <PanelHeader separator={false}>
        Лента
        </PanelHeader>
      <Group className={s.content}>
        <TextPost user={user} text='Я скажу то, что для тебя не новость: мир не такой уж солнечный и приветливый. Это очень опасное, жесткое место, и если только дашь слабину, он опрокинет с такой силой тебя, что больше уже не встанешь. Ни ты, ни я, никто на свете, не бьёт так сильно, как жизнь! Совсем не важно, как ты ударишь, а важно, какой держишь удар, как двигаешься вперёд. Будешь идти — ИДИ! Если с испугу не свернёшь... Только так побеждают! Если знаешь, чего ты стоишь — иди и бери своё! Но будь готов удары держать, а не забрасывай кф на 2 месяца ' description='обычный день' />

        <TextPost user={user2} text='Годно! ' description='солнечно' />
      </Group>
    </Panel>
  );
}

export default Feed;