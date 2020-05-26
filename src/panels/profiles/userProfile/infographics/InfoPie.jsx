import React, { useState } from 'react';
import {
    Title, Header, Group
} from "@vkontakte/vkui";
import Pie from './Pie';

import styles from './infoCss.module.css'



const getMediumValue = (arr) => {
    let sum = 0;

    for (let i = 0; i < arr.length; ++i) sum += arr[i];


    let ans = (sum / arr.length).toFixed(1);
    if(ans[2] === '0') ans = ans[0];

    return ans;
};


const InfoPie = (props) => {
    
    return (
        <Group header={<Header mode="secondary">Недавние</Header>} style={{ width: '100%' }} >
            <div className={styles.grid}>
                <div style={{ height: 200, width: 200, margin: 'auto' }} className={styles.pie}><Pie data={props.data}/></div>
                <div className={styles.info}>

                    <div className={styles.outer} style={{ height: '100%', width: '100%' }}>
                        <span className={styles.inner}>
                            {/* <span style={{ fontSize: 80 }}>{getMediumValue(props.data.map(e=>Number(e)))}<br /></span> */}
                            {/* <span style={{ color: 'gray' }}>Среднее значение за все время</span> */}
                            <Title level="1" weight="semibold">{getMediumValue(props.data.map(e=>Number(e)))}</Title>
                            <Title level="3" weight="regular">Среднее значение за все время</Title>    
                            
                        </span>
                    </div>
                </div>
            </div>

        </Group>
    )
}





export default InfoPie

