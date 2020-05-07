import React, {useState, useEffect} from "react";
import {
    ModalPage, ModalPageHeader, ModalRoot,
    PanelHeaderButton, Tabs, TabsItem, HorizontalScroll,
    usePlatform, IOS, ANDROID, Header,
} from "@vkontakte/vkui";
import api from "../../../utils/api";

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

const StatsModal = (props) => {
    let [activeTab, setTab] = useState("mood");
    let [entries, setEntries] = useState([]);
    const platform = usePlatform();

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
                {
                    entries.map(entry => entry ? (<Header key={entry.entryId}>{entry[activeTab]}</Header>) : null)
                }
            </ModalPage>
        </ModalRoot>
    );
};

export default StatsModal;