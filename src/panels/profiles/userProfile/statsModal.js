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

    return (
        <ModalRoot activeModal={props.activeModal} onClose={() => props.setModal(null)}>
            <ModalPage id="stats" onClose={() => props.setModal(null)} header={
                <ModalPageHeader
                    left={(<>{
                        platform === ANDROID &&
                        <PanelHeaderButton onClick={() => props.setModal(null)}>
                            <Icon24Cancel/>
                        </PanelHeaderButton>
                    }</>)}
                    right={(<>{
                        platform === IOS &&
                        <PanelHeaderButton onClick={() => props.setModal(null)}>
                            <Icon24Dismiss/>
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
                <Div style={{height: "200px", paddingTop: "0"}}>
                    <GradientChart data={stats.map(stat => stat ? stat[activeTab] : null)}/>
                </Div>
                {
                    stats.map(
                        stat => stat ? (<Header key={stat.entryId}>{stat[activeTab]}</Header>) : null
                    )
                }
            </ModalPage>
        </ModalRoot>
    );
};

export default StatsModal;