import React from 'react';
import {ResponsivePie} from '@nivo/pie'

const data = [
    {
        "id": "id1",
        "label": "значение 1",
        "value": 1,
        "color": "hsl(143, 70%, 50%)"
    },
    {
        "id": "id2",
        "label": "значение 2",
        "value": 1,
        "color": "hsl(174, 70%, 50%)"
    },
    {
        "id": "id3",
        "label": "значение 3",
        "value": 2,
        "color": "hsl(82, 70%, 50%)"
    },
    {
        "id": "id4",
        "label": "значение 4",
        "value": 5,
        "color": "hsl(172, 70%, 50%)"
    },
    {
        "id": "id5",
        "label": "значение 5",
        "value": 3,
        "color": "hsl(277, 70%, 50%)"
    }
];

const Pie = (props) => (
    <ResponsivePie
        data={data}
        // margin={{top: 40, right: 10, bottom: 80, left: 10}}
        sortByValue={true}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={2}
        colors={{scheme: 'nivo'}}
        borderWidth={1}
        borderColor={{from: 'color', modifiers: [['darker', 0.2]]}}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{from: 'color'}}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        enableRadialLabels={false}
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
            }

        ]}
        fill={[
            {
                match: {
                    id: 'id1'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'id2'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'id3'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'id4'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'id5'
                },
                id: 'lines'
            },
        ]}
    />
);

export default Pie

