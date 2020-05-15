
import React from 'react';
import { Cell, CardGrid } from '@vkontakte/vkui';
import s from './TextPost.module.css'
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Card from '@vkontakte/vkui/dist/components/Card/Card'
import Text from '@vkontakte/vkui/dist/components/Typography/Text/Text'
import Title from '@vkontakte/vkui/dist/components/Typography/Title/Title'

/*
 *  <Text weight='medium' className={s.userInfo} >
              {`${user.first_name} ${user.last_name}`}
            </Text>
            <Text weight='medium' className={s.date} >
              {`${date.day} ${date.month} ${date.hour}:${date.minute}`}
            </Text>
 * 
 * 
 *  <div className={s.data}>
          <Text weight='medium' className={s.description}>
            {description}
            </Text>
          <Text weight='medium' className={s.postText} >
            {text}
          </Text>
        </div>
 * 
 * 
 */

const TextPost = ({ user, text, id, description, date }) => {
  return (
    <CardGrid className={s.content}>
      <Card size="l" mode="shadow">
        <Cell className={s.reference} description={`${date.day} ${date.month} ${date.hour}:${date.minute}`}
          before={user.photo_200 ? <Avatar size={40} src={user.photo_200} /> : null}
        >
          {`${user.first_name} ${user.last_name}`}
        </Cell>
        <Title level='3' weight='semibold' className={s.description} >
          {description}
        </Title>
        <Text weight='medium' className={s.postText} >
          {text}
        </Text>
        <div style={{ height: 25 }} />
      </Card>
    </CardGrid>
  );
}

export default TextPost;