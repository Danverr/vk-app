import React from 'react';
import {ResponsiveStream} from '@nivo/stream';
import {linearGradientDef} from '@nivo/core';


const createDate = (arr) => {

    let objArr = [];

    for (let it of arr)
        objArr.push({'main': it});

    return objArr
};

const getGradient = (val) => {
    if(val >=1 && val <= 1.2) return 'gradientE'
    if(val > 1.2 && val <= 2) return 'gradientD'
    if(val > 2 && val <= 3) return 'gradientC'
    if(val > 3 && val <= 4) return 'gradientB'
    if(val > 4) return 'gradientAAA'



    // if(val > 4 && val<4.8) return 'gradientA'
    // if(val >= 4.8) return 'gradientAAA'
};

let getMiddleValue = (arr) => {
    let sum = 0;
    for(let it of arr) sum += Number(it) 
    return sum/arr.length
}


const setCol = ['#3ae374', '#32ff7e', '#fffa65', '#ffaf40', '#ff4d4d']


// let data = [5,3,5,5,5,1,1,5,4]



const GradientChart = (props) => {
    let data = props.data
    console.log(createDate(data))
    console.log(getMiddleValue(data))
    console.log(getGradient(getMiddleValue(data)))


    return (

        <ResponsiveStream
            data={createDate(data)}
            keys={['main']}
            // width={5000}
            margin={{top: 10, right: 5, bottom: 20, left: 5}}
            enableGridX={false}
            enableGridY={false}
            axisTop={null}
            axisRight={null}
            offsetType="none"
            colors={{scheme: 'category10'}}
            borderColor={{theme: 'background'}}
            defs={[
                linearGradientDef('gradientAAA', [
                    {offset: 50, color: '#4bcffa', opacity: .7},
                    {offset: 95, color: '#70a1ff', opacity: .5}
                ]),
                linearGradientDef('gradientAAA_r', [
                    {offset: 50, color: '#70a1ff', opacity: .5},
                    {offset: 95, color: '#7bed9f', opacity: .7}
                ]),
                linearGradientDef('gradientA', [
                    {offset: 30, color: '#70a1ff', opacity: .9},
                    {offset: 95, color: '#7bed9f', opacity: .8},
                ]),
                linearGradientDef('gradientB', [
                    {offset: 50, color: setCol[0], opacity: .7},
                    {offset: 95, color: setCol[2], opacity: .9}
                ]),
                linearGradientDef('gradientC', [
                    {offset: 50, color: '#ffdd59', opacity: .8},
                    {offset: 95, color: '#ff793f', opacity: .9}
                ]),
                linearGradientDef('gradientD', [
                    {offset: 50, color: '#f19066', opacity: .8},
                    {offset: 90, color: '#ff4757', opacity: .8},
                ]),
                linearGradientDef('gradientE', [
                    {offset: 30, color: '#b33939', opacity: .9},
                    {offset: 95, color: '#000000', opacity: .9}
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
                {match: {id: 'main'}, id: getGradient(getMiddleValue(data))},
            ]}
        />


    )
};

export default GradientChart

// getGradient(getMiddleValue(data))
