import React from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const Weekdays = (props) => {
    return (
        <div className = "weekdays">
            <Text weight = 'regular' className = 'weekday'> пн </Text> 
            <Text weight = 'regular' className = 'weekday'> вт </Text> 
            <Text weight = 'regular' className = 'weekday'> ср </Text> 
            <Text weight = 'regular' className = 'weekday'> чт </Text> 
            <Text weight = 'regular' className = 'weekday'> пт </Text> 
            <Text weight = 'regular' className = 'weekday'> сб </Text> 
            <Text weight = 'regular' className = 'weekday'> вс </Text> 
        </div>
    );
}

export default Weekdays;
