import React from 'react';
import {ResponsiveStream} from '@nivo/tream';
import {linearGradientDef} from '@nivo/core';

const createDate = (arr) => {
    let objArr = [];

    for (let it of arr)
        objArr.push({'main': it});

    return objArr
};

const getGradient = (maxDataValue) => {
    switch (maxDataValue) {
        case 5:
            return 'gradientA';
        case 4:
            return 'gradientB';
        case 3:
            return 'gradientC';
        case 2:
            return 'gradientD';
        case 1:
            return 'gradientE';
    }
};

const getMaxValue = (arr) => {
    let mx = 0;

    for (let it of arr)
        mx = Math.max(mx, it);

    return mx
};

const setCol = ['#3ae374', '#32ff7e', '#fffa65', '#ffaf40', '#ff4d4d']

const GradientChart = (props) => {
    return (
        <ResponsiveStream
            data={createDate(props.data)}
            keys={['main']}
            margin={{top: 10, right: 5, bottom: 20, left: 5}}
            enableGridX={false}
            enableGridY={false}
            axisTop={null}
            axisRight={null}
            // axisBottom={null}
            offsetType="none"
            colors={{scheme: 'category10'}}
            borderColor={{theme: 'background'}}
            defs={[
                linearGradientDef('gradientA', [
                    // { offset: 10, color: setCol[0] },
                    // { offset: 30, color: setCol[1], opacity: .5 },
                    // { offset: 60, color: setCol[2] },
                    // { offset: 85, color: setCol[3], opacity: .9},
                    // { offset: 95, color: setCol[4], opacity: .6 },
                    {offset: 50, color: setCol[0], opacity: .7},
                    {offset: 95, color: setCol[2], opacity: .9}
                ]),
                linearGradientDef('gradientB', [
                    // { offset: 25, color: setCol[1], opacity: .8 },
                    // { offset: 50, color: setCol[2] },
                    // { offset: 80, color: setCol[3] },
                    // { offset: 95, color: setCol[4], opacity: .8 },
                    {offset: 50, color: setCol[2], opacity: .9},
                    {offset: 95, color: setCol[4], opacity: .7}
                ]),
                linearGradientDef('gradientC', [
                    {offset: 30, color: setCol[2], opacity: .7},
                    {offset: 70, color: setCol[3]},
                    {offset: 90, color: setCol[4], opacity: .8},
                ]),
                linearGradientDef('gradientD', [
                    {offset: 50, color: setCol[3]},
                    {offset: 90, color: setCol[4], opacity: .8},
                ]),
                linearGradientDef('gradientE', [
                    {offset: 100, color: setCol[4], opacity: 0.85},
                ]),


                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                },


            ]}
            fill={[
                {match: {id: 'main'}, id: getGradient(getMaxValue(props.data))},
            ]}
        />
    )
};

export default GradientChart



