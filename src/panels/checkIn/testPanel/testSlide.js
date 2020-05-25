import React, {useState, useEffect} from 'react';
import {Button, Div, Panel, PanelHeader, PanelHeaderBack} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import style from './testSlide.module.css';

import QuestionCard from "../questionCard/questionCard";

const TestSlide = (props) => {
    const [activeButton, setActiveButton] = useState(props.answer[props.slideData.name] - 1);

    const onRadioClick = (i) => {
        if (activeButton !== i) {
            props.answer[props.slideData.name] = props.slideData.buttons[i].value;
            props.setAnswer(props.answer);
            setActiveButton(i);

            props.goToNext();
        } else {
            props.answer[props.slideData.name] = null;
            props.setAnswer(props.answer);
            setActiveButton(null);
        }
    };

    const getRadioButtons = () => {
        return props.slideData.buttons.map((button, i) => {
            return (<Button
                key={i}
                className={style.radioButton}
                mode={activeButton === i ? "primary" : "outline"}
                before={<img src={button.img} alt=""/>}
                onClick={() => onRadioClick(i)}
                size="xl"
            >
                {button.text}
            </Button>);
        });
    };

    const [radioButtons, setRadioButtons] = useState(getRadioButtons());
    useEffect(() => {
        setRadioButtons(getRadioButtons());
    }, [activeButton]);

    return (
        <Div className={style.slideContainer}>
            <QuestionCard question={props.slideData.question}/>
            <div className={style.formLayout}>
                {radioButtons}
            </div>
        </Div>
    );
};

export default TestSlide;

