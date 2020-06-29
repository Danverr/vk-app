import React from 'react';
import { Text } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import s from './loadSpinner.module.css'

const DaylioPanelContent = (props) => {
    const PI = Math.PI;
    const R = 40;

    return (

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className={s.beforeContent}>
                <Text className={s.timeLeft} weight='medium'> {`${Math.ceil(props.a / props.b * 100)}%`} </Text>
                <svg className={s.circle}>
                    <circle
                        cx="45" cy="45" r={R} stroke="rgb(63,138,224)" strokeWidth="6" fill="transparent"
                        style={{
                            'strokeDasharray': (2 * PI * R * (props.a / props.b)).toString() + " 1000",
                        }}
                    />
                </svg>
            </div>
            <Text className={s.dialog} weight='medium'> {(props.a == props.b) && "Загрузка завершена"} </Text>
        </div>
    );
}
export default DaylioPanelContent;