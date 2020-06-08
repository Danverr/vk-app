
import React, { useState, useEffect } from 'react';
import s from './DeleteBar.module.css'

import { Snackbar } from '@vkontakte/vkui';
import { setTimeout } from 'core-js';

const Seconds = 5000;
const PI = 3.141592653589793;
const R = 11;

const Clock = () => {
    const [timeLeft, setTimeLeft] = useState(Seconds);

    const recursion = () => {
        if (!timeLeft) return;
        setTimeout(() => { setTimeLeft(timeLeft - 10) }, 8);
    };

    return (
        <svg className={s.circle}>
            <circle
                cx="12" cy="12" r={R} stroke="rgb(63,138,224)" strokeWidth="2" fill="transparent"
                style={{
                    'strokeDasharray': (2 * PI * R * (timeLeft / Seconds)).toString() + " 1000",
                }}
            />
            {recursion()}
        </svg>
    );
};

const NumberTimer = () => {
    const [timeLeft, setTimeLeft] = useState(Seconds);

    const recursion = () => {
        if (!timeLeft) return;
        setTimeout(() => { setTimeLeft(timeLeft - 1000) }, 1000);
    };

    return (
        <div className={s.timeLeft}>
            {timeLeft / 1000}
            {recursion()}
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
            before={<div> <NumberTimer/> <Clock /> </div>}
        >
            Удалено
        </Snackbar>
    )
};

export default DeleteBar;

