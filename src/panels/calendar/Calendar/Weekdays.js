import React from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import s from './Calendar.module.css';

const Weekdays = (props) => {
    return (
        <div className = {s.weekdays}>
            <Text weight = 'regular' className = {s.weekday}> пн </Text> 
            <Text weight = 'regular' className = {s.weekday}> вт </Text> 
            <Text weight = 'regular' className = {s.weekday}> ср </Text> 
            <Text weight = 'regular' className = {s.weekday}> чт </Text> 
            <Text weight = 'regular' className = {s.weekday}> пт </Text> 
            <Text weight = 'regular' className = {s.weekday}> сб </Text> 
            <Text weight = 'regular' className = {s.weekday}> вс </Text> 
        </div>
    );
}

export default Weekdays;
