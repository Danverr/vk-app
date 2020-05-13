
import React from 'react';
import { Cell, CardGrid } from '@vkontakte/vkui';
import s from './TextPost.module.css'
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Card from '@vkontakte/vkui/dist/components/Card/Card'
import Text from '@vkontakte/vkui/dist/components/Typography/Text/Text'

const TextPost = ({ user, text, id, description }) => {
  return (
    <CardGrid className={s.content}>
      <Card size="l" mode="shadow">
        <Cell className={s.reference}
          before={user.photo_200 ? <Avatar size={40} src={user.photo_200} /> : null}
        >
          <div className={s.info}>
            <Text weight='medium' className={s.userInfo} >
              {`${user.first_name} ${user.last_name}`}
            </Text>
            <Text weight='medium' className={s.userDecsription} >
              {description}
            </Text>
          </div>
        </Cell>
        <div className={s.postText}>
          <Text weight='medium'>
            {text}
          </Text>
        </div>
        <div style={{ height: 25 }} />
      </Card>
    </CardGrid>
  );
}

export default TextPost;