import React from 'react';
import {Div, Gradient, Subhead, Title} from "@vkontakte/vkui";
import styles from "./questionSection.module.css";

const QuestionSection = ({question, date}) => {
    return (
        <Gradient className={styles.questionSection} to="top" mode="tint">
            <Div className={styles.questionText}>
                <Title level="2" weight="semibold">{question}</Title>
                <Subhead weight="regular">Запись за {date.format("LLL")}</Subhead>
            </Div>
        </Gradient>
    );
};

export default QuestionSection;