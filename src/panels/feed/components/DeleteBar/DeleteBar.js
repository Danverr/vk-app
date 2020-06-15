
import React from 'react';
import s from './DeleteBar.module.css'
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { Snackbar, Text } from '@vkontakte/vkui';

const renderTime = ({ remainingTime }) => {
    return (
        <div className={s.timer}>
            <Text className="value">{remainingTime}</Text>
        </div>
    );
};

const DeleteBar = (props) => {
    return (
        <Snackbar
            layout="horizontal"
            onClose={props.finallyDeletePost}
            action="Отменить"
            onActionClick={props.reconstructionPostOnFeed}
            duration={5000}
            before={<CountdownCircleTimer
                size={24}
                strokeWidth={2}
                isPlaying
                duration={5}
                colors={[["#3f8ae0"]]}
                onComplete={() => [true, 1000]}>
                {renderTime}
            </CountdownCircleTimer>}
        >
            Пост удалён
        </Snackbar>
    )
};

export default DeleteBar;

