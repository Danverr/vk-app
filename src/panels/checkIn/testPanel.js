import React, {useState, useEffect} from 'react';
import {Card, Button, Avatar, Div, Cell, Panel, PanelHeader, PanelHeaderBack, Header} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import style from './checkInStory.module.css';

import roboHead from "vk-react-app/src/assets/roboHead.svg";

const TestPanel = (props) => {
    console.log(props);
    const [activeButton, setActiveButton] = useState(-1);

    const onRadioClick = (i) => {
        if (activeButton !== i) {
            props.answer[props.panelData.name] = i + 1;
            props.setAnswer(props.answer);
            setActiveButton(i);

            setTimeout(props.goTo, 1000);
        } else {
            props.answer[props.panelData.name] = null;
            props.setAnswer(props.answer);
            setActiveButton(-1);
        }
    };

    const getBullets = () => {
        let bullets = [];

        for (let i = 0; i < props.panelsCount; i++) {
            let bulletStyles = style.bullet;

            if (i === props.panelIndex) {
                bulletStyles += " " + style.bulletSelected;
            }

            bullets.push(<div className={bulletStyles}/>);
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
                             left={<PanelHeaderBack onClick={() => window.history.back()}/>}>
                    <div className={style.bulletsContainer}>
                        {getBullets()}
                    </div>
                </PanelHeader>
                <Div className={style.contentContainer}>
                    <Card className={style.console} mode="shadow" size="l">
                        <Cell before={<Avatar size={48} src={roboHead}/>}
                              description={<div className={style.consoleHeaderText}>Health Check-in</div>}>
                            <div className={style.consoleHeaderText}>ROBOCONSOLE v1.0</div>
                        </Cell>
                        <Div className={style.consoleContent}>
                            <div>> Запись за {props.date}</div>
                            <div>> {props.panelData.question}</div>
                            <div>> _</div>
                        </Div>
                    </Card>
                    <div className={style.formLayout}>
                        {radioButtons}
                    </div>
                </Div>
            </div>
        </Panel>
    );
};

export default TestPanel;

