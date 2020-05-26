import React, { useState } from 'react';
import Flickity from 'react-flickity-component'

import {
Div
} from "@vkontakte/vkui";
import GradientChart from './gradientChart'
import styles from './infoCss.module.css'

const switchWidth = (size) => {
    if (size < 10) return '100%'
    else return size * 10 + '%'
}

const Chart = (props) => {

    let data = props.data
    
    if(data == null) return (null)

    return (
        <Div style={{ height: "220px", paddingTop: "0" }}>
            <Flickity
                elementType={'div'}
                options={{ freeScroll: true, prevNextButtons: false, cellAlign: 'left', pageDots: false, contain: true }}
            >
                <div className={styles.block} style={{ height: 200, width: switchWidth(data.length) }}><GradientChart data={data.length ? data : null} /></div>
                <div style={{ height: 200, width: 1 }}></div>
            </Flickity>
        </Div>
    )
}

export default Chart

