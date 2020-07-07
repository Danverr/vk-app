import {Cell, FormLayout, FormLayoutGroup, Input, Textarea, Switch, Button, ScreenSpinner} from "@vkontakte/vkui";
import React, {useState} from "react";
import api from "../../../utils/api";
import QuestionSection from "../questionSection/questionSection";

const SubmitPanel = (props) => {
    const {answer, setAnswer} = props;
    const [isChecked, setCheck] = useState(answer.isPublic.val);
    const [titleText, setTitleText] = useState(answer.title.val);
    const [noteText, setNoteText] = useState(answer.note.val);
    const [formMessage, setFormMessage] = useState({text: " ", status: "default"});

    // Обрабатываем изменения в поле заголовка
    const handleTitle = (event, name) => {
        props.answer.title.val = event.target.value;
        setAnswer(answer);
        setTitleText(event.target.value);
    };

    // Обрабатываем изменения в поле текста записки
    const handleNote = (event) => {
        answer.note.val = event.target.value;
        setAnswer(answer);
        setNoteText(event.target.value);
    };

    // Переключаем доступ друзей к записи
    const switchPublic = (event) => {
        answer.isPublic.val = event.target.checked ? 1 : 0;
        setAnswer(answer);
        setCheck(event.target.checked);
    };

    // Проверяем и отправляем данные
    const saveAnswer = () => {
        if (!answer.mood.val || !answer.stress.val || !answer.anxiety.val || !answer.date.val) {
            let text = "";

            if (!answer.mood.val) text = "Настроение не указано!";
            else if (!answer.stress.val) text = "Стресс стресс не указан!";
            else if (!answer.anxiety.val) text = "Тревожность не указана!";
            else if (!answer.date.val) text = "Дата не указана!";

            setFormMessage({
                text: text,
                status: "error"
            });
        } else {
            props.setPopout(<ScreenSpinner/>);

            let entry = {};
            for (const key in answer) entry[key] = answer[key].val;
            entry.date = answer.date.val.clone().utc().format("YYYY-MM-DD HH:mm:ss");

            api("POST", "/entries/", {
                entries: JSON.stringify([entry])
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
                            mood: {val: null, index: null},
                            stress: {val: null, index: null},
                            anxiety: {val: null, index: null},
                            title: {val: "", index: null},
                            note: {val: "", index: null},
                            date: {val: null, index: null},
                            isPublic: {val: 0, index: null},
                        });

                        props.nav.panelHistory.checkIn = [0];
                        props.setEntryAdded(true);
                        props.nav.goTo("feed");
                    }
                })
                .finally(() => { // Выполнить в любом случае
                    props.setPopout(null);
                });
        }
    };

    return (
        <div>
            <QuestionSection question={"Что вам запомнилось?"} date={answer.date.val}/>
            <FormLayout style={{paddingBottom: "16px"}}>

                <FormLayoutGroup>
                    <Input placeholder="Назовите этот день"
                           maxLength="64"
                           value={titleText}
                           onChange={handleTitle}
                    />
                    <Textarea placeholder="Просто начните писать"
                              maxLength="2048"
                              value={noteText}
                              onChange={handleNote}
                    />
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