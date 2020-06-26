import {Cell, Div, FormLayout, FormLayoutGroup, Input, Textarea, Switch, Button, ScreenSpinner} from "@vkontakte/vkui";
import React, {useState} from "react";
import api from "../../../utils/api";

import QuestionCard from "../questionCard/questionCard";

const SubmitPanel = (props) => {
    const {answer, setAnswer} = props;
    const [isChecked, setCheck] = useState(answer.isPublic);
    const [titleText, setTitleText] = useState(answer.title);
    const [noteText, setNoteText] = useState(answer.note);
    const [formMessage, setFormMessage] = useState({text: " ", status: "default"});

    // Обрабатываем изменения в поле заголовка
    const handleTitle = (event, name) => {
        props.answer.title = event.target.value;
        setAnswer(answer);
        setTitleText(event.target.value);
    };

    // Обрабатываем изменения в поле текста записки
    const handleNote = (event) => {
        answer.note = event.target.value;
        setAnswer(answer);
        setNoteText(event.target.value);
    };

    // Переключаем доступ друзей к записи
    const switchPublic = (event) => {
        answer.isPublic = event.target.checked ? 1 : 0;
        setAnswer(answer);
        setCheck(event.target.checked);
    };

    // Проверяем и отправляем данные
    const saveAnswer = () => {
        if (!answer.mood || !answer.stress || !answer.anxiety) {
            setFormMessage({
                text: "Настроение, тревожность или стресс не указаны!",
                status: "error"
            });
        } else {
            props.setLoading(<ScreenSpinner/>);

            api("POST", "/entries/", {
                entries: JSON.stringify([answer])
            })
                .then((res) => {
                    const status = res.response ? res.response.status : res.status;

                    if (status >= 300) { // Ошибка
                        setFormMessage({
                            text: "Упс! Что-то пошло не так. Попробуйте еще раз",
                            status: "error"
                        });
                    } else { // Успех
                        setAnswer({
                            mood: null,
                            stress: null,
                            anxiety: null,
                            title: "",
                            note: "",
                            isPublic: 0,
                        });

                        props.nav.goTo("feed");
                    }
                })
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