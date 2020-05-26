
import React, { useState, useEffect } from 'react';
import s from './DeleteBar.module.css'

import Icon24Delete from '@vkontakte/icons/dist/24/delete';
import { Snackbar, Text } from '@vkontakte/vkui';
import { setTimeout } from 'core-js';

const Seconds = 5000;
const PI = 3.141592653589793;
const R = 11;

const Clock = () => {
    const [timeLeft, setTimeLeft] = useState(Seconds);

    const recursion = () => {
        if (timeLeft === 0) return;
        setTimeout(() => { setTimeLeft(timeLeft - 125) }, 125);
    };

    return (
        <div>
            <svg className={s.circle}>
                <circle
                    cx="12" cy="12" r={R} stroke="rgb(63,138,224)" stroke-width="2" fill="transparent"
                    style={{
                        'stroke-dasharray': (2 * PI * R * (timeLeft / Seconds)).toString() + " 1000",
                    }}
                />
            </svg>
            {recursion()}
        </div>
    );
};

const NumberTimer = () => {
    const [timeLeft, setTimeLeft] = useState(Seconds);

    const recursion = () => {
        if (timeLeft === 0) return;
        setTimeout(() => { setTimeLeft(timeLeft - 1000) }, 1000);
    };

    return (
        <div className={s.timeLeft}>
            {timeLeft / 1000}
            {recursion()}
            </div>
        );
}

const Timer = () => {

    // <div className={s.timeLeft}> {timeLeft / 1000} </div>

    return (
        <div>
            <NumberTimer/>
            <Clock/>
        </div>
    );
};

const DeleteBar = (props) => {
    return (
        <Snackbar
            layout="horizontal"
            onClose={props.goDeletePost}
            action="Отменить"
            onActionClick={props.reconstruction}
            duration={Seconds}
            before={<Timer />}
        >
            Удалено
        </Snackbar>
    )
}

export default DeleteBar;