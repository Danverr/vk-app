import React from 'react';
import { Panel, PanelHeader, Group, CardGrid, Card, Div, View, Header, Button } from '@vkontakte/vkui';


import GradientChart from './GradientChart';



const Statistics = (props) => {

    // Конец данных


    let activeStatistics = props.statePaint.activeStatistics

    const clickByButton = (id) => {
        props.setActiveStatistics(id)
    }

    const getStyleButton = (id) => {
        if(id == activeStatistics) return 'overlay_secondary'
        else return 'overlay_primary'
    }


    return (
        <Div >
            <Header aside={<div style={{ color: 'gray' }}>Серия 6 подрят</div>}>
                Статистика
               </Header>

            <Div style={{ background: '#232323', borderRadius : 30}}>
                <Button mode={getStyleButton('mood')}       onClick={() => {clickByButton('mood')}} >Настроение </Button>
                <Button mode={getStyleButton('stress')}     onClick={() => {clickByButton('stress')}}>Стресс</Button>
                <Button mode={getStyleButton('depression')} onClick={() => {clickByButton('depression')}}>Депрессия</Button>
            </Div>


            <div style={{ height: 200 }}>
                <GradientChart data={props.statePaint[props.statePaint.activeStatistics]}/>
            </div>





        </Div>




    )
}




export default Statistics


