import React, {useState} from "react";
import {
    ModalPage, ModalPageHeader, ModalRoot,
    PanelHeaderButton, Tabs, TabsItem, HorizontalScroll,
    usePlatform, IOS, ANDROID, Header,
} from "@vkontakte/vkui";

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

const StatsModal = (props) => {
    let [activeTab, setTab] = useState("moodTab");
    const platform = usePlatform();

    return (
        <ModalRoot activeModal={props.activeModal} onClose={() => props.setModal(null)}>
            <ModalPage id="statsModal" onClose={() => props.setModal(null)} header={
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
                            onClick={() => setTab('moodTab')}
                            selected={activeTab === 'moodTab'}
                        >
                            Настроение
                        </TabsItem>
                        <TabsItem
                            onClick={() => setTab('stressTab')}
                            selected={activeTab === 'stressTab'}
                        >
                            Стресс
                        </TabsItem>
                        <TabsItem
                            onClick={() => setTab('anxietyTab')}
                            selected={activeTab === 'anxietyTab'}
                        >
                            Тревожность
                        </TabsItem>
                    </HorizontalScroll>
                </Tabs>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
                <Header>русские вперед</Header>
            </ModalPage>
        </ModalRoot>
    );
};

export default StatsModal;