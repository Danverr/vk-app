<<<<<<< HEAD
import React, {useState, useEffect} from "react";
import {
    ModalPage, ModalPageHeader, ModalRoot,
    PanelHeaderButton, Tabs, TabsItem, HorizontalScroll, Div,
    usePlatform, IOS, ANDROID, Header,
} from "@vkontakte/vkui";
import api from "../../../utils/api";
import GradientChart from "./infographics/gradientChart";

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
=======
import React, { useState, useEffect } from "react";

import {
    ModalPage, ModalPageHeader, ModalRoot,
    PanelHeaderButton, Tabs, TabsItem,
    usePlatform, IOS, ANDROID, Alert
} from "@vkontakte/vkui";
import api from "../../../utils/api";


import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import styles from './statsModalCss.module.css'
import InfoPie from "./infographics/InfoPie";


import Chart from "./infographics/Chart";

>>>>>>> chart

const StatsModal = (props) => {
    let [activeTab, setTab] = useState("mood");
    let [stats, setStats] = useState([]);
    const platform = usePlatform();

    // Загрузка статистики пользователя
    useEffect(() => {
        const fetchStats = async () => {
            if (props.user == null) return;
            
            await api("GET", "/entries/stats/", {
                userId: props.user.id,
            }).then((res) => {
                setStats(res.data);
            });
        };

        fetchStats();
    }, [props.user]);

<<<<<<< HEAD
    return (
        <ModalRoot activeModal={props.activeModal} onClose={() => props.setModal(null)}>
=======

    // entries = [
    //     { mood: 1 }, { mood: 5 }, { mood: 3 }, { mood: 4 }, { mood: 1 },
    // ]





    return (




        <ModalRoot activeModal={props.activeModal} onClose={() => props.setModal(null)} className={styles.main}>

>>>>>>> chart
            <ModalPage id="stats" onClose={() => props.setModal(null)} header={
                <ModalPageHeader
                    left={(<>{
                        platform === ANDROID &&
                        <PanelHeaderButton onClick={() => props.setModal(null)}>
<<<<<<< HEAD
                            <Icon24Cancel/>
=======
                            <Icon24Cancel />
>>>>>>> chart
                        </PanelHeaderButton>
                    }</>)}
                    right={(<>{
                        platform === IOS &&
                        <PanelHeaderButton onClick={() => props.setModal(null)}>
<<<<<<< HEAD
                            <Icon24Dismiss/>
=======
                            <Icon24Dismiss />
>>>>>>> chart
                        </PanelHeaderButton>
                    }</>)}
                >
                    Статистика
                </ModalPageHeader>
            }>
<<<<<<< HEAD
                <Tabs mode="buttons">
                    <HorizontalScroll>
=======



                {!entries.length ? <div style={{paddingTop: '20%'}}></div> :
                    <Tabs mode="buttons">
>>>>>>> chart
                        <TabsItem
                            onClick={() => setTab('mood')}
                            selected={activeTab === 'mood'}
                        >
                            Настроение
                        </TabsItem>
                        <TabsItem
                            onClick={() => setTab('stress')}
                            selected={activeTab === 'stress'}
                        >
                            Стресс
<<<<<<< HEAD
                        </TabsItem>
=======
                          </TabsItem>
>>>>>>> chart
                        <TabsItem
                            onClick={() => setTab('anxiety')}
                            selected={activeTab === 'anxiety'}
                        >
                            Тревожность
                        </TabsItem>
<<<<<<< HEAD
                    </HorizontalScroll>
                </Tabs>
                <Div style={{height: "200px", paddingTop: "0"}}>
                    <GradientChart data={stats.map(stat => stat ? stat[activeTab] : null)}/>
                </Div>
                {
                    stats.map(
                        stat => stat ? (<Header key={stat.entryId}>{stat[activeTab]}</Header>) : null
                    )
                }
=======
                    </Tabs>
                }


                {!entries.length
                    ? <div>
                        <Alert
                            actions={[{
                                title: 'Закрыть',
                                autoclose: true,
                                mode: 'cancel'
                            }]}
                            onClose={() => props.setModal(null)}
                        >
                            <h2>Недостаточно данных</h2>
                            <p>Пройдите опрос хотя бы 2 раза</p>
                        </Alert>
                        <div style={{paddingBottom: '100%'}}></div>
                    </div>
                    : <div>
              
                        <Chart data={entries.map(entry => entry ? entry[activeTab] : null)}/>        
                        <InfoPie data={entries.map(entry => entry ? entry[activeTab] : null)} />

                    </div>}








>>>>>>> chart
            </ModalPage>
        </ModalRoot>
    );
};

<<<<<<< HEAD
export default StatsModal;
=======
export default StatsModal;




{/* <Div style={{ height: "220px", paddingTop: "0" }}>
<Flickity
    elementType={'div'}
    options={{ freeScroll: true, prevNextButtons: false, cellAlign: 'left', pageDots: false, contain: true }}
>
    <div className={styles.block} style={{ height: 200, width: switchWidth(entries.length) }}><GradientChart data={entries.map(entry => entry ? entry[activeTab] : null)} /></div>
    <div style={{ height: 200, width: 1 }}></div>
</Flickity>
</Div> */}





// <ModalPage id="stats" onClose={() => props.setModal(null)} header={
//     <ModalPageHeader
//         left={(<>{
//             platform === ANDROID &&
//             <PanelHeaderButton onClick={() => props.setModal(null)}>
//                 <Icon24Cancel />
//             </PanelHeaderButton>
//         }</>)}
//         right={(<>{
//             platform === IOS &&
//             <PanelHeaderButton onClick={() => props.setModal(null)}>
//                 <Icon24Dismiss />
//             </PanelHeaderButton>
//         }</>)}
//     >
//         Статистика
//     </ModalPageHeader>
// }>
>>>>>>> chart
