import {
	FormLayout,
	FormStatus,
	Input,
	Textarea,
	Switch,
	Button,
	ScreenSpinner,
	Cell,
} from "@vkontakte/vkui";
import React, { useState } from "react";
import api from "../../../utils/api";
import styles from "./submitPanel.module.css";
import getAnswer from "../../../utils/getAnswer";

import Icon12Lock from "@vkontakte/icons/dist/12/lock";

import QuestionSection from "../questionSection/questionSection";
import entryWrapper from "../../../components/entryWrapper";

const SubmitPanel = (props) => {
	const { answer, setAnswer, setActiveSlideIndex } = props;
	const [isChecked, setCheck] = useState(!answer.isPublic.val);
	const [titleText, setTitleText] = useState(answer.title.val);
	const [noteText, setNoteText] = useState(answer.note.val);
	const [formStatus, setFormStatus] = useState({
		title: "",
		text: "",
		mode: "default",
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
		answer.isPublic.val = event.target.checked ? 0 : 1;
		setAnswer(answer);
		setCheck(event.target.checked);
	};

	// Проверяем и отправляем данные
	const saveAnswer = () => {
		if (!answer.mood.val || !answer.stress.val || !answer.anxiety.val) {
			let text = "Не указаны параметры:";
			if (!answer.mood.val) text += ", настроение";
			if (!answer.stress.val) text += ", стресс";
			if (!answer.anxiety.val) text += ", тревожность";
			text = text.replace(":,", ": ");

			setFormStatus({
				title: "Недостаточно данных",
				text: text,
				mode: "error",
			});
		} else {
			props.setPopout(<ScreenSpinner />);
			setFormStatus({
				title: "",
				text: "",
				mode: "default",
			});

			const method = props.isEntryUpdate ? "PUT" : "POST";

			// Форматируем данные
			let data = {};

			if (props.isEntryUpdate) {
				for (const key in answer) {
					if (key !== "date") data[key] = answer[key].val;
				}
			} else {
				for (const key in answer) {
					if (key !== "entryId") data[key] = answer[key].val;
				}

				data.date = answer.date.val.clone().utc().format("YYYY-MM-DD HH:mm:ss");
				data = { entries: JSON.stringify([data]) };
			}

			api(method, "/v1.1/entries/", data)
				.then((result) => {
					let entryData = Object.assign({}, answer);

					if (result.data) {
						entryData.entryId.val = result.data;
						entryWrapper.addEntryToFeedList(entryData);
					} else {
						entryWrapper.editEntryFromFeedList(entryData);
					}

					setAnswer(getAnswer());
					setActiveSlideIndex(0);
					props.setEntryAdded(true);

					if (!props.isEntryUpdate) {
						window["yaCounter65896372"].reachGoal("entryCreated");
						props.nav.scrollHistory["feed__main"] = 0;
						props.nav.goTo("feed");
					} else {
						props.nav.goBack();
					}
				})
				.catch((error) => {
					setFormStatus({
						title: "Упс, что-то пошло не так!",
						text: error.message,
						mode: "error",
					});
				})
				.finally(() => {
					// Выполнить в любом случае
					props.setPopout(null);
				});
		}
	};

	return (
		<>
			<QuestionSection question={"Что вам запомнилось?"} date={answer.date.val} />
			<FormLayout className={styles.formLayout}>
				{formStatus.text.length === 0 ? null : (
					<FormStatus header={formStatus.title} mode={formStatus.mode}>
						{formStatus.text}
					</FormStatus>
				)}

				<Input
					top="Заголовок"
					placeholder="Можно оставить пустым"
					maxLength="64"
					value={titleText}
					onChange={handleTitle}
				/>
				<Textarea
					top="Текст заметки"
					placeholder="Можно оставить пустым"
					maxLength="2048"
					value={noteText}
					onChange={handleNote}
				/>
				<Cell
					className={styles.privacySwitch}
					asideContent={
						<Switch checked={isChecked} onClick={switchPublic} onChange={() => null} />
					}
					description="Заголовок и текст будут скрыты"
				>
					<span>Приватная запись</span>
					<Icon12Lock className={styles.lockIcon} />
				</Cell>

				<Button size="xl" mode="primary" onClick={saveAnswer}>
					Сохранить
				</Button>
			</FormLayout>
		</>
	);
};

export default SubmitPanel;
