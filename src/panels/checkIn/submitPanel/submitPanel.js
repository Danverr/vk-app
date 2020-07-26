import {
    FormLayout, FormLayoutGroup, FormStatus, Input, Textarea,
    Switch, Button, ScreenSpinner, Cell
} from "@vkontakte/vkui";
import React, {useState} from "react";
import api from "../../../utils/api";
import getAnswer from "../getAnswer";

import QuestionSection from "../questionSection/questionSection";
import entryWrapper from "../../../components/entryWrapper";

const SubmitPanel = (props) => {
    const {answer, setAnswer} = props; 
    const [isChecked, setCheck] = useState(answer.isPublic.val);
    const [titleText, setTitleText] = useState(answer.title.val);
    const [noteText, setNoteText] = useState(answer.note.val);
    const [formStatus, setFormStatus] = useState({
        title: "",
        text: "",
        mode: "default"
    });

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
            let text = "Не указаны параметры:";
            if (!answer.date.val) text += ", дата";
            if (!answer.mood.val) text += ", настроение";
            if (!answer.stress.val) text += ", стресс";
            if (!answer.anxiety.val) text += ", тревожность";
            text = text.replace(":,", ": ");

            setFormStatus({
                title: "Недостаточно данных",
                text: text,
                mode: "error"
            });
        } else {
            props.setPopout(<ScreenSpinner/>);
            setFormStatus({
                title: "",
                text: "",
                mode: "default"
            });

            const method = props.isEntryUpdate ? "PUT" : "POST";

            // Форматируем данные
            let data = {};

            if (props.isEntryUpdate) {
                for (const key in answer) {
                    if (answer[key].val && key !== "date") data[key] = answer[key].val;
                }
            } else {
                for (const key in answer) {
                    if (key !== "entryId") data[key] = answer[key].val;
                }   

                data.date = answer.date.val.clone().utc().format("YYYY-MM-DD HH:mm:ss");
                data = {entries: JSON.stringify([data])};
            }

            api(method, "/entries/", data)
                .then((result) => {
                    let entryData = Object.assign({}, answer);
                    if (result.data){
                        entryData.entryId.val = result.data;
                    }
                    entryWrapper.editEntryFromFeedList(entryData);
                    setAnswer(getAnswer());
                    props.nav.panelHistory.checkIn = [0];
                    props.setEntryAdded(true);
                    props.nav.goTo("feed");
                })
                .catch((error) => {
                    setFormStatus({
                        title: "Упс, что-то пошло не так!",
                        text: error.message,
                        mode: "error"
                    });
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
                    {
                        formStatus.text.length === 0 ? null :
                            <FormStatus header={formStatus.title} mode={formStatus.mode}>
                                {formStatus.text}
                            </FormStatus>
                    }

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
                >
                    Сохранить
                </Button>

            </FormLayout>
        </div>
    );
};

export default SubmitPanel;