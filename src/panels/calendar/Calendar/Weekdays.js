import React from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import s from './Calendar.module.css';

const Weekdays = (props) => {
    return (
        <tr className = {s.weekdays}><th><Text weight = 'regular' className = {s.weekday}>пн</Text></th>
            <th><Text weight = 'regular' className = {s.weekday}>вт</Text></th>
            <th><Text weight = 'regular' className = {s.weekday}>ср</Text></th>
            <th><Text weight = 'regular' className = {s.weekday}>чт</Text></th>
            <th><Text weight = 'regular' className = {s.weekday}>пт</Text></th>
            <th><Text weight = 'regular' className = {s.weekday}>сб</Text></th>
            <th><Text weight = 'regular' className = {s.weekday}>вс</Text></th></tr>
    );
}

export default Weekdays;
