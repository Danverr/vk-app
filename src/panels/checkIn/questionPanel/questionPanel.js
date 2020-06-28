import React, {useState, useEffect} from 'react';
import {Button, Div} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import style from './questionPanel.module.css';
import QuestionSection from "../questionSection/questionSection";

const QuestionPanel = (props) => {
    const {answer, setAnswer, slideData, goToNext} = props;
    const [selectedIndex, setSelectedIndex] = useState(answer[slideData.param].index);

    const onRadioClick = (buttonValue, buttonIndex) => {
        const callback = (buttonValue, buttonIndex) => {
            let newAnswer = {...answer};

            newAnswer[slideData.param].val = buttonValue;
            newAnswer[slideData.param].index = buttonIndex;
            setSelectedIndex(buttonIndex);
            goToNext();

            setAnswer(newAnswer);
        };

        if (selectedIndex === buttonIndex) {
            let newAnswer = {...answer};
            newAnswer[slideData.param].val = null;
            newAnswer[slideData.param].index = null;
            setSelectedIndex(null);

            setAnswer(newAnswer);
            return;
        }

        if (typeof buttonValue === "function") {
            buttonValue(props.setPopout, callback, buttonIndex);
        } else {
            callback(buttonValue, buttonIndex);
        }
    };

    const getRadioButtons = () => {
        return slideData.buttons.map((button, i) => {
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
        });
    };

    const [radioButtons, setRadioButtons] = useState(getRadioButtons());
    useEffect(() => {
        setRadioButtons(getRadioButtons());
        // eslint-disable-next-line
    }, [selectedIndex]);

    return (
        <div>
            <QuestionSection question={slideData.question} date={answer.date.val}/>
            <Div className={style.slideContainer}>
                <div className={style.formLayout}>
                    {radioButtons}
                </div>
            </Div>
        </div>
    );
};

export default QuestionPanel;

