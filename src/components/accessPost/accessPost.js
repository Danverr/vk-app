import React, { useState} from "react";
import { RichCell, Avatar, Card, Button, ScreenSpinner, Tooltip } from "@vkontakte/vkui";
import "./accessPost.module.css";
import ErrorSnackbar from "../errorSnackbar/errorSnackbar";
import DoneSnackbar from "../doneSnackbar/doneSnackbar";
import entryWrapper from "../entryWrapper";

const AccessPost = (props) => {
	const postData = props.postData;
	const { accessTokenScope, userToken, fetchUserToken } = postData.state;
	const user = postData.user;
	const phr = ["Дала", "Дал"];
	const [haveEdge, setHaveEdge] = useState(postData.haveEdge);

	const avatar = user.photo_100;

	const iHaveToolTip = () => {
		if (!postData.wrapper || !postData.wrapper.currentToolTip)
			return 0;
		const g = postData.wrapper.currentToolTip;
		if (g === -1)
			return 0;
		if (g[0] !== 1 || g[1] !== user.id)
			return 0;
		return 1;
	}

	let showTool = iHaveToolTip();

	let [tool, setTool] = useState(showTool);

	if (postData.wrapper && postData.wrapper.rerenderTP) {
		postData.wrapper.rerenderAP[user.id] = setTool;
	}

	const action = async () => {
		postData.nav.saveScroll();
		if (userToken) { // токен уже получен
			addEdge();
		}
		else if (!userToken && accessTokenScope.split(",").indexOf("friends") !== -1) { // токен не получен, но разрешение есть
			postData.setPopout(<ScreenSpinner />);
			fetchUserToken(addEdge);
		}
		else { // нет разрешения
			postData.wrapper.addEdge = addEdge;
			postData.setActiveModal("tokenQuery");
		}
	};

	const addEdge = async () => {
		postData.setPopout(<ScreenSpinner />);
		try {
			await postData.postEdge(user.id);
			entryWrapper.pseudoFriends[user.id] = 1;
			setHaveEdge(1);
			postData.setPopout(null);
			postData.setSnackField(
				<DoneSnackbar
					onClose={() => {
						postData.setSnackField(null);
					}}
				/>
			);
		} catch (error) {
			postData.setPopout(null);
			postData.setSnackField(
				<ErrorSnackbar
					onClose={() => {
						postData.setSnackField(null);
					}}
				/>
			);
		}
	};

	return (
		<Card size="l" mode="shadow" className="TextPost">
			<Tooltip
				offsetX={6}
				offsetY={12}
				isShown={tool}
				onClose={() => {
					if (!iHaveToolTip()) return;
					setTool(0);
					document.body.style.overflow = 'visible';
					postData.wrapper.currentToolTip = -1;
					postData.wrapper.setCurrentScroll()
					postData.wrapper.goNextToolTip()
				}}
				header="Кто-то выдал Вам доступ!"
				text="Включите уведомление о выдаче доступа в настройках"
			>
				<RichCell
					disabled
					before={<Avatar size={72} src={avatar} />}
					caption={`${phr[user.sex === 2 ? 1 : 0]} Вам доступ к записям`}
				>
					{`${user.first_name} ${user.last_name}`}
				</RichCell>
			</Tooltip>
			<Button onClick={action} size="xl" disabled={haveEdge}>
				{haveEdge ? "Вы уже дали доступ" : "Дать доступ в ответ"}
			</Button>
		</Card>
	);
};

export default AccessPost;
