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


const StatsModal = (props) => {
    let [activeTab, setTab] = useState("mood");
    let [entries, setEntries] = useState([]);
    const platform = usePlatform();

    // Загрузка записей пользователя
    useEffect(() => {
        const fetchEntries = async () => {
            if (props.user == null) return;

            const entriesPromise = await api("GET", "/entries/", {
                userId: props.user.id,
            });

            setEntries(entriesPromise.data);
        };

        fetchEntries();
    }, [props.user]);


    // entries = [
    //     { mood: 1 }, { mood: 5 }, { mood: 3 }, { mood: 4 }, { mood: 1 },
    // ]





    return (




        <ModalRoot activeModal={props.activeModal} onClose={() => props.setModal(null)} className={styles.main}>

            <ModalPage id="stats" onClose={() => props.setModal(null)} header={
                <ModalPageHeader
                    left={(<>{
                        platform === ANDROID &&
                        <PanelHeaderButton onClick={() => props.setModal(null)}>
                            <Icon24Cancel />
                        </PanelHeaderButton>
                    }</>)}
                    right={(<>{
                        platform === IOS &&
                        <PanelHeaderButton onClick={() => props.setModal(null)}>
                            <Icon24Dismiss />
                        </PanelHeaderButton>
                    }</>)}
                >
                    Статистика
                </ModalPageHeader>
            }>



                {!entries.length ? <div style={{paddingTop: '20%'}}></div> :
                    <Tabs mode="buttons">
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
                          </TabsItem>
                        <TabsItem
                            onClick={() => setTab('anxiety')}
                            selected={activeTab === 'anxiety'}
                        >
                            Тревожность
                        </TabsItem>
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








            </ModalPage>
        </ModalRoot>
    );
};

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