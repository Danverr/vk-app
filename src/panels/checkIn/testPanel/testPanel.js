import React, {useState, useEffect} from 'react';
import {Button, Div, Panel, PanelHeader, PanelHeaderBack} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import style from './testPanel.module.css';

import QuestionCard from "../questionCard/questionCard";

const TestPanel = (props) => {
    const [activeButton, setActiveButton] = useState(props.answer[props.panelData.name] - 1);

    const onRadioClick = (i) => {
        if (activeButton !== i) {
            props.answer[props.panelData.name] = props.panelData.buttons[i].value;
            props.setAnswer(props.answer);
            setActiveButton(i);

            setTimeout(props.goTo, 500);
        } else {
            props.answer[props.panelData.name] = null;
            props.setAnswer(props.answer);
            setActiveButton(null);
        }
    };

    const getRadioButtons = () => {
        return props.panelData.buttons.map((button, i) => {
            return (<Button
                key={i}
                className={style.radioButton}
                mode={activeButton === i ? "primary" : "outline"}
                before={<img src={button.img} alt=""/>}
                onClick={() => onRadioClick(i)}
                size="xl">
                {button.text}
            </Button>);
        });
    };

    const [radioButtons, setRadioButtons] = useState(getRadioButtons());
    useEffect(() => {
        setRadioButtons(getRadioButtons());
    }, [activeButton]);

    return (
        <Panel id={props.id}>

            <PanelHeader separator={false}
                         left={props.panelIndex == 0 ? null :
                             <PanelHeaderBack onClick={() => window.history.back()}/>}>
                {props.bullets}
            </PanelHeader>

            <Div>
                <QuestionCard question={props.panelData.question}/>
                <div className={style.formLayout}>
                    {radioButtons}
                    <Button className={style.skipButton} mode="tertiary" onClick={props.goTo}>
                        Пропустить
                    </Button>
                </div>
            </Div>

        </Panel>
    );
};

export default TestPanel;

