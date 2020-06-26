import React, {useState, useEffect} from 'react';
import {Button, Div} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import style from './testSlide.module.css';
import emoji from "../../../utils/getEmoji";

import QuestionCard from "../questionCard/questionCard";

const TestSlide = (props) => {
    const {answer, setAnswer, slideData} = props;
    const [selectedValue, setSelectedValue] = useState(answer[slideData.name]);

    const onRadioClick = (buttonValue) => {
        let newAnswer = Object.assign(answer);

        if (selectedValue !== buttonValue) {
            newAnswer[slideData.name] = buttonValue;
            setSelectedValue(buttonValue);
            props.goToNext();
        } else {
            newAnswer[slideData.name] = null;
            setSelectedValue(null);
        }

        setAnswer(newAnswer);
    };

    const getRadioButtons = () => {
        return slideData.buttons.map((button, i) => {
            return (<Button
                key={i}
                className={style.radioButton}
                mode={button.value === selectedValue ? "primary" : "outline"}
                before={<img src={emoji[slideData.name][button.value - 1]} alt=""/>}
                onClick={() => onRadioClick(button.value)}
                size="xl"
            >
                {button.text}
            </Button>);
        });
    };

    const [radioButtons, setRadioButtons] = useState(getRadioButtons());
    useEffect(() => {
        setRadioButtons(getRadioButtons());
    }, [selectedValue]);

    return (
        <Div className={style.slideContainer}>
            <QuestionCard question={slideData.question}/>
            <div className={style.formLayout}>
                {radioButtons}
            </div>
        </Div>
    );
};

export default TestSlide;

