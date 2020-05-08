import React, { useState } from 'react';
import { Panel, PanelHeader, Group, CardGrid, Card, Div, View, Header } from '@vkontakte/vkui';

const MediumMood = (props) => {

    const getMediumValue = (arr) => {
        let firstSum = 0, secondSum = 0;

        for (let i = 0; i < arr.length / 2; ++i) firstSum += arr[i];
        for (let i = arr.length / 2; i < arr.length; ++i) secondSum += arr[i];

        let ans = [((firstSum * 2) / arr.length).toFixed(1), ((secondSum * 2) / arr.length).toFixed(1)];

        if(ans[0][2] === '0') ans[0] = ans[0][0];
        if(ans[1][2] === '0') ans[1] = ans[1][0];

        return ans;
    };

    return (
        <Group >
            <Header>
                Среднее настроение за 3 проверки
            </Header>

            <CardGrid>
                <Card size="m" mode="outline">
                    <div style={{ height: 96 }}>
                        <div style={{ textAlign: 'center', fontSize: 36, fontFamily: 'serif' }} >
                            {getMediumValue(props.statePaint.mood)[0]}
                        </div>
                        <div style={{ textAlign: 'center', fontFamily: 'cursive', fontSize: 14 }} >
                            Прошлые 3 проверки
                        </div>
                    </div>
                </Card>
                <Card size="m" mode="outline">
                    <div style={{ height: 96 }}>
                        <div style={{ textAlign: 'center', fontSize: 36, fontFamily: 'serif' }} >
                            {getMediumValue(props.statePaint.mood)[1]}
                        </div>
                        <div style={{ textAlign: 'center', fontFamily: 'cursive', fontSize: 14 }} >
                            Текущие 3 проверки
                        </div>
                    </div>
                </Card>
            </CardGrid>
        </Group>
    )
};

export default MediumMood


