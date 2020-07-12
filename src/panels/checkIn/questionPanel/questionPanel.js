import React, {useState} from 'react';
import {Button, Div} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import style from './questionPanel.module.css';
import QuestionSection from "../questionSection/questionSection";

const QuestionPanel = (props) => {
    const {slideData} = props;
    const [selectedIndex, setSelectedIndex] = useState(props.answer[slideData.param].index);

    const onRadioClick = (buttonValue, buttonIndex) => {
        const callback = (buttonValue, buttonIndex) => {
            let newAnswer = {...props.answer};

            newAnswer[slideData.param].val = buttonValue;
            newAnswer[slideData.param].index = buttonIndex;
            setSelectedIndex(buttonIndex);
            props.goToNext();

            props.setAnswer(newAnswer);
        };

        if (selectedIndex === buttonIndex) {
            let newAnswer = {...props.answer};
            newAnswer[slideData.param].val = null;
            newAnswer[slideData.param].index = null;
            setSelectedIndex(null);

            props.setAnswer(newAnswer);
            return;
        }

        if (typeof buttonValue === "function") {
            buttonValue(props.setPopout, callback, buttonIndex);
        } else {
            callback(buttonValue, buttonIndex);
        }
    };

    return (
        <div>
            <QuestionSection question={slideData.question} date={props.answer.date.val}/>
            <Div className={style.slideContainer}>
                <div className={style.formLayout}>
                    {
                        slideData.buttons.map((button, i) => {
                            return (
                                <Button
                                    key={i}
                                    className={style.radioButton}
                                    mode={i === selectedIndex ? "primary" : "outline"}
                                    before={button.icon ? <img src={button.icon} alt=""/> : null}
                                    onClick={() => onRadioClick(button.value, i)}
                                    size="xl"
                                >
                                    {button.text}
                                </Button>
                            );
                        })
                    }
                </div>
            </Div>
        </div>
    );
};

export default QuestionPanel;

