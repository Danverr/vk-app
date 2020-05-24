import React, { useState, useEffect } from "react";
import Flickity from 'react-flickity-component'
import {
    ModalPage, ModalPageHeader, ModalRoot,
    PanelHeaderButton, Tabs, TabsItem, HorizontalScroll, Div,
    usePlatform, IOS, ANDROID, Header, Group
} from "@vkontakte/vkui";
import api from "../../../utils/api";
import GradientChart from "./infographics/gradientChart";

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Pie from "./infographics/Pie";
import styles from './statsModalCss.module.css'
import InfoPie from "./infographics/InfoPie";



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
                <Tabs mode="buttons">
                    <HorizontalScroll>


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

                    </HorizontalScroll>
                </Tabs>



                <Div style={{ height: "220px", paddingTop: "0" }}>
                    <Flickity
                        elementType={'div'}
                        options={{ freeScroll: true, prevNextButtons: false, cellAlign: 'left', pageDots: false, contain: true }}
                    >
                        <div className={styles.block} style={{ height: 200, width: entries.length * 10 + '%'}}><GradientChart data={entries.map(entry => entry ? entry[activeTab] : null)} /></div>
                        <div style={{ height: 200, width: 1 }}></div>
                    </Flickity>
                </Div>



            


            <InfoPie data={entries.map(entry => entry ? entry[activeTab] : null)}/>    






            </ModalPage>
        </ModalRoot>
    );
};

export default StatsModal;











    {/* <Group header={<Header mode="secondary">Недавние</Header>} style={{ width: '100%' }} >
                    <div className={styles.grid}>
                        <div style={{ height: 200, width: 200, margin: 'auto'}} className={styles.pie}><Pie /></div>
                        <div className={styles.info}>

                            <div className={styles.outer} style={{height: '100%', width: '100%'}}>
                                <span className={styles.inner}>
                                    <span style={{fontSize: 80}}>3.5 <br/></span>
                                    <span style={{color: 'gray'}}>Среднее значение за все время</span>
                                </span>
                            </div>
                        </div>
                    </div>

                </Group> */}