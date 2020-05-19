import React, {useState, useEffect} from 'react';
import {Button, Div, Panel, PanelHeader, PanelHeaderBack} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import style from '../checkInStory.module.css';

import QuestionCard from "../questionCard/questionCard";

const TestPanel = (props) => {
    const [activeButton, setActiveButton] = useState(props.answer[props.panelData.name] - 1);

    const onRadioClick = (i) => {
        if (activeButton !== i) {
            props.answer[props.panelData.name] = i + 1;
            props.setAnswer(props.answer);
            setActiveButton(i);

            setTimeout(props.goTo, 500);
        } else {
            props.answer[props.panelData.name] = null;
            props.setAnswer(props.answer);
            setActiveButton(null);
        }
    };

    const getBullets = () => {
        let bullets = [];

        for (let i = 0; i < props.panelsCount; i++) {
            let bulletStyles = style.bullet;

            if (i === props.panelIndex) {
                bulletStyles += " " + style.bulletSelected;
            }

            bullets.push(<div key={i} className={bulletStyles}/>);
        }

        return (bullets);
    };

    const getRadioButtons = () => {
        return props.panelData.buttons.map((button, i) => {
            return (<Button
                key={i}
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
            <div className={style.panelContainer}>
                <PanelHeader separator={false}
                             left={props.panelIndex == 0 ? null :
                                 <PanelHeaderBack onClick={() => window.history.back()}/>}>
                    <div className={style.bulletsContainer}>
                        {getBullets()}
                    </div>
                </PanelHeader>
                <Div className={style.contentContainer}>
                    <QuestionCard date={props.date} question={props.panelData.question}/>
                    <div className={style.formLayout}>
                        {radioButtons}
                    </div>
                </Div>
            </div>
        </Panel>
    );
};

export default TestPanel;

