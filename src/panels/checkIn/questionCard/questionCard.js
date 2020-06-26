import React, {useState, useEffect} from 'react';
import {Card, Div, Cell} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import style from './questionCard.module.css';

const QuestionCard = (props) => {
    const [isCursorVisible, setCursorVisability] = useState(false);

    useEffect(() => {
        // Мигаем курсором через timeout мс
        const blink = setTimeout(() => {
            setCursorVisability(!isCursorVisible);
        }, 800); // timeout

        // Указываем, как сбросить этот эффект
        return () => clearTimeout(blink);
    }, [isCursorVisible]);

    return (
        <Card className={style.console} mode="shadow" size="l">
            <Cell description={<div className={style.consoleHeaderText}>Health Check-in</div>}>
                <div className={style.consoleHeaderText}>ROBOCONSOLE v1.0</div>
            </Cell>
            <Div className={style.consoleContent}>
                <div>> Запись за сегодня</div>
                <div>> {props.question}</div>
                <div>> {isCursorVisible ? "_" : ""}</div>
            </Div>
        </Card>
    );
};

export default QuestionCard;

