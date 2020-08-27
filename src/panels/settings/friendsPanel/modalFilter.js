import React, { useState, useEffect } from 'react';
import {
    Button,
    ModalRoot,
    ModalPage,
    ModalPageHeader,
    PanelHeaderButton,
    List,
    Cell,
    FormLayout,
    FormLayoutGroup,
    Separator
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const ModalFilter = (props) => {
    const [from, setFrom] = useState(props.from);
    const [to, setTo] = useState(props.to);
    const {onChange} = props;
    
    useEffect(() => {
        onChange({ from, to });
    }, [from, to, onChange])

    const changeFilter = (e, curval, a, b, setval) => {
        if (e.target.checked) {
            if (curval === 'none')
                setval(a);
            else setval('both');
        }
        else {
            if (curval === 'both')
                setval(b);
            else setval('none');
        }
    }

    return (
        <ModalRoot activeModal="filter" onClose={props.onClose}>
            <ModalPage id="filter"
                header={
                    <ModalPageHeader
                        right={<PanelHeaderButton mode = "tertiary" onClick={() => {
                            setFrom('none');
                            setTo('none');
                        }}>Очистить</PanelHeaderButton>}>
                        Фильтры
                </ModalPageHeader>}>
                <FormLayout>
                    <FormLayoutGroup>
                        <List>
                            <Cell selectable
                                checked={from === 'yes' || from === 'both'}
                                onChange={(e) => changeFilter(e, from, 'yes', 'no', setFrom)}>
                                Дал мне доступ
                            </Cell>
                            <Cell selectable
                                checked={from === 'no' || from === 'both'}
                                onChange={(e) => changeFilter(e, from, 'no', 'yes', setFrom)}>
                                Не дал мне доступ
                            </Cell>
                            <Separator/>
                            <Cell selectable
                                checked={to === 'yes' || to === 'both'}
                                onChange={(e) => changeFilter(e, to, 'yes', 'no', setTo)}>
                                Есть доступ к моей статистике
                            </Cell>
                            <Cell selectable
                                checked={to === 'no' || to === 'both'}
                                onChange={(e) => changeFilter(e, to, 'no', 'yes', setTo)}>
                                Нет доступа к моей статистике
                            </Cell>
                        </List>
                        <Button type = "button" size="xl" onClick={props.onClose}> Закрыть </Button>
                    </FormLayoutGroup>
                </FormLayout>
            </ModalPage>
        </ModalRoot>
    );
};

export default ModalFilter;