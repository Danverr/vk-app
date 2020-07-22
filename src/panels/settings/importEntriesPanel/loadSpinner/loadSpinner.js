import React from 'react';
import { Text } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import s from './loadSpinner.module.css'
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';

const loadSpinner = (props) => {
    return (
        <div className={s.container}>
            <Icon56CheckCircleOutline className = {s.done} fill = 'var(--accent)' height = {96} width = {96} />
            <Text weight="medium" className={s.dialog}> Загрузка завершена </Text>
        </div>
    );
}
export default loadSpinner;