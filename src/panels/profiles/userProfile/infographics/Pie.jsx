import React, {useState} from 'react';
import {ResponsivePie} from '@nivo/pie'
import {linearGradientDef} from '@nivo/core';

const data = [
    {
        "id": "id1",
        "label": "Получено оценок 1",
        "value": 2,
        "color": "hsl(143, 70%, 50%)"
    },
    {
        "id": "id2",
        "label": "Получено оценок 1",
        "value": 2,
        "color": "hsl(174, 70%, 50%)"
    },
    {
        "id": "id3",
        "label": "Получено оценок 1",
        "value": 2,
        "color": "hsl(82, 70%, 50%)"
    },
    {
        "id": "id4",
        "label": "Получено оценок 1",
        "value": 2,
        "color": "hsl(172, 70%, 50%)"
    },
    {
        "id": "id5",
        "label": "Получено оценок 1",
        "value": 2,
        "color": "hsl(277, 70%, 50%)"
    }
];


const generateData = (values) => {
    let val = [0,0,0,0,0]
    for(let it of values) val[Number(it)-1]++
    
    let returnData = [
        {
            "id": "id1",
            "label": "Получено оценок 1",
            "value": val[0],
            "color": "hsl(143, 70%, 50%)"
        },
        {
            "id": "id2",
            "label": "Получено оценок 2",
            "value": val[1],
            "color": "hsl(174, 70%, 50%)"
        },
        {
            "id": "id3",
            "label": "Получено оценок 3",
            "value": val[2],
            "color": "hsl(82, 70%, 50%)"
        },
        {
            "id": "id4",
            "label": "Получено оценок 4",
            "value": val[3],
            "color": "hsl(172, 70%, 50%)"
        },
        {
            "id": "id5",
            "label": "Получено оценок 5",
            "value": val[4],
            "color": "hsl(277, 70%, 50%)"
        }
    ];
    return returnData
}




const Pie = (props) => {

    
    


    return(
        <ResponsivePie
        data={generateData(props.data)}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        sortByValue={false}
        innerRadius={0}
        padAngle={0}
        cornerRadius={0}
        colors={{scheme: 'nivo'}}
        borderWidth={0}
        borderColor={{from: 'color', modifiers: [['darker', 0.2]]}}
        motionStiffness={90}
        motionDamping={15}
        enableRadialLabels={false}
        slicesLabelsTextColor="#333333"
        sliceLabel={function(e){return e.value > 1 ? e.value : null}}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            },
            {
                id: "squares",
                type: "patternSquares",
                size: 3,
                padding: 10,
                stagger: false,
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.7)',
            },
            linearGradientDef('gradientAAA', [
                {offset: 50, color: '#4bcffa', opacity: .7},
                {offset: 95, color: '#70a1ff', opacity: .5}
            ]),
            linearGradientDef('gradient5', [
                {offset: 50, color: '#2ed573', opacity: .7},
                {offset: 95, color: '#7bed9f', opacity: .3}
            ]),
            linearGradientDef('gradient4', [
                {offset: 30, color: '#ffaf40', opacity: .5},
                {offset: 95, color: '#ff9f1a', opacity: .8},
            ]),
            linearGradientDef('gradient3', [
                {offset: 50, color: '#fffa65', opacity: .6}, 
                {offset: 95, color: '#fff200', opacity: .9}
            ]),
            linearGradientDef('gradient2', [
                {offset: 50, color: '#ffdd59', opacity: .9},
                {offset: 95, color: '#ff793f', opacity: .9}
            ]),
            linearGradientDef('gradient1', [
                {offset: 50, color: '#f19066', opacity: .8},
                {offset: 90, color: '#ff4757', opacity: .8},
            ]),



        ]}
        fill={[
            {match: {id: 'id1'}, id: 'gradient1'},
            {match: {id: 'id2'}, id: 'gradient2'},
            {match: {id: 'id3'}, id: 'gradient3'},
            {match: {id: 'id4'}, id: 'gradient5'},
            {match: {id: 'id5'}, id: 'gradientAAA'},
        ]}
    />
    )
}

export default Pie



// innerRadius={0.1}
// padAngle={1.5}
// cornerRadius={7}