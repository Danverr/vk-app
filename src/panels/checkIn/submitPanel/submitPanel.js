import {
    Panel, PanelHeader, PanelHeaderBack, Cell, Div,
    FormLayout, FormLayoutGroup, Input, Textarea, Switch, Button, ScreenSpinner
} from "@vkontakte/vkui";
import React, {useState, useEffect} from "react";
import api from "../../../utils/api";

import QuestionCard from "../questionCard/questionCard";
import style from "../checkInStory.module.css";

const SubmitPanel = (props) => {
    const [isChecked, setCheck] = useState(props.answer.isPublic);
    const [titleText, setTitleText] = useState(props.answer.title);
    const [noteText, setNoteText] = useState(props.answer.note);
    const [formMessage, setFormMessage] = useState({text: " ", status: "default"});

    // Обрабатываем изменения в поле заголовка
    const handleTitle = (event, name) => {
        props.answer.title = event.target.value;
        props.setAnswer(props.answer);
        setTitleText(event.target.value);
    };

    // Обрабатываем изменения в поле текста записки
    const handleNote = (event) => {
        props.answer.note = event.target.value;
        props.setAnswer(props.answer);
        setNoteText(event.target.value);
    };

    // Переключаем доступ друзей к записи
    const switchPublic = (event) => {
        props.answer.isPublic = event.target.checked ? 1 : 0;
        props.setAnswer(props.answer);
        setCheck(event.target.checked);
    };

    // Проверяем и отправляем данные
    const saveAnswer = () => {
        if (!props.answer.mood || !props.answer.stress || !props.answer.anxiety) {
            setFormMessage({
                text: "Настроение, тревожность или стресс не указаны!",
                status: "error"
            });
        } else {
            props.setLoading(<ScreenSpinner/>);

            api("POST", "/entries/", props.answer)
                .then(() => { // Успех
                    props.setAnswer({
                        userId: null,
                        mood: null,
                        stress: null,
                        anxiety: null,
                        title: "",
                        note: "",
                        isPublic: 0,
                    });

                    props.nav.goTo("feed");
                }, (error) => setFormMessage({ // Ошибка
                        text: error,
                        status: "error"
                    }
                ))
                .finally(() => { // Выполнить в любом случае
                    props.setLoading(null);
                });
        }
    };

    return (
        <div>

            <Div>
                <QuestionCard question="Оставьте заметку об этом дне!"/>
            </Div>

            <FormLayout style={{paddingBottom: "16px"}}>
                <FormLayoutGroup>
                    <Input placeholder="Название"
                           maxLength="64"
                           value={titleText}
                           onChange={handleTitle}/>
                    <Textarea placeholder="Как прошел ваш день?"
                              maxLength="2048"
                              value={noteText}
                              onChange={handleNote}/>
                    <Cell asideContent={<Switch checked={isChecked} onClick={switchPublic} onChange={() => null}/>}>
                        Видно друзьям
                    </Cell>
                </FormLayoutGroup>
                <Button
                    size="xl"
                    mode="primary"
                    onClick={saveAnswer}
                    status={formMessage.status}
                    bottom={formMessage.text}
                >
                    Сохранить
                </Button>
            </FormLayout>

        </div>
    );
};

export default SubmitPanel;