import React from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const Weekdays = (props) => {
    return (
        <div className = "weekdays">
            <Text mode = 'regular' className = 'weekday'> пн </Text> 
            <Text mode = 'regular' className = 'weekday'> вт </Text> 
            <Text mode = 'regular' className = 'weekday'> ср </Text> 
            <Text mode = 'regular' className = 'weekday'> чт </Text> 
            <Text mode = 'regular' className = 'weekday'> пт </Text> 
            <Text mode = 'regular' className = 'weekday'> сб </Text> 
            <Text mode = 'regular' className = 'weekday'> вс </Text> 
        </div>
    );
}

export default Weekdays;
