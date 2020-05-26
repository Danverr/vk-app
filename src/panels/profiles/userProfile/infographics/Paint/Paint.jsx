import React, {useState} from 'react';
import {Panel, PanelHeader, Group, CardGrid, Card, Div, View, Header} from '@vkontakte/vkui';
<<<<<<< HEAD
import Statistics from './statistics/Statistics';
=======
>>>>>>> chart
import MediumMood from './MediumMood/MediumMood';
import Pie from './Pie/Pie';


const Paint = (props) => {
    // В props лежит activeStatistics 

    // Состояние для удобного управления внутри Статистики 
    let [statePaint, setStatePaint] = useState({
        activeStatistics: 'mood',
        mood: [3, 5, 2, 5, 2, 5],
        stress: [2, 1, 1, 2, 1, 2],
        depression: [1, 3, 4, 1, 1, 3]
    })

    // Изменить activeStatistics при помощи изменения внутреннего состояния и внешней функции перерисовки rerenderEntireTree
    const setActiveStatistics = (id) => {
        let clone = Object.assign({}, statePaint);
        clone.activeStatistics = id
        setStatePaint(clone)
        // props.rerenderEntireTree(props.state)
    }

    return (
        <View activePanel="paint">
            <Panel id="paint">


                <PanelHeader>
                    У меня по ИЗО 5 стоит
                </PanelHeader>


<<<<<<< HEAD
                <Group>
                    <Statistics statePaint={statePaint} setActiveStatistics={setActiveStatistics}/>
                </Group>


                <MediumMood statePaint={statePaint}/>
=======
               


                {/* <MediumMood statePaint={statePaint}/> */}

>>>>>>> chart
                <Group>
                    <div style={{height: 300, width: window.innerWidth * 0.5}}>
                        <Pie/>
                    </div>
                </Group>


            </Panel>

        </View>


    )
}


export default Paint


