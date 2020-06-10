
import React, { useState, useEffect } from 'react';
import s from './DeleteBar.module.css'

import { Snackbar, Text } from '@vkontakte/vkui';
import { setTimeout } from 'core-js';

const Seconds = 5000;
const PI = Math.PI;
const R = 11;

const Clock = () => {
    const [timeLeft, setTimeLeft] = useState(Seconds);

    const recursion = () => {
        if (!timeLeft) return;
        setTimeout(() => { setTimeLeft(timeLeft - 10) }, 7.5);
    };

    return (
        <div className={s.beforeContent}>
            <Text className={s.timeLeft} weight='medium'> {Math.ceil(timeLeft / 1000)} </Text>
            <svg className={s.circle}>
                <circle
                    cx="12" cy="12" r={R} stroke="rgb(63,138,224)" strokeWidth="2" fill="transparent"
                    style={{
                        'strokeDasharray': (2 * PI * R * (timeLeft / Seconds)).toString() + " 1000",
                    }}
                />
                {recursion()}
            </svg>
        </div>
    );
};

const DeleteBar = (props) => {
    const [wasrec, setwasrec] = useState(null);

    const reconstructionPost = () => {
        const newPosts = [...props.posts];
        newPosts[newPosts.findIndex((el) => (el.post.entryId === props.lastPost.post.entryId))].delete = 0;
        props.setPosts(newPosts);
        props.setPosts(newPosts);
        props.setDisplayPosts(newPosts.map(props.renderData));
        setwasrec(1);
    }

    const onClose = () => {
        if (!wasrec) {
            props.finallyDeletePost(props.lastPost);
        } else {
            props.setPostWasDeleted(null);
        }
    }

    return (
        <Snackbar
            layout="horizontal"
            onClose={onClose}
            action="Отменить"
            onActionClick={reconstructionPost}
            duration={Seconds}
            before={<Clock/>}
        >
            Удалено
        </Snackbar>
    )
};

export default DeleteBar;

