import React, { useState, useEffect } from "react";
import { Panel, PanelHeader, View, Cell, CellButton, Group, Footer } from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import "@vkontakte/vkui/dist/vkui.css";

import Icon28Notifications from "@vkontakte/icons/dist/28/notifications";
import Icon28PrivacyOutline from "@vkontakte/icons/dist/28/privacy_outline";
import Icon28UploadOutline from "@vkontakte/icons/dist/28/upload_outline";

import NotificationsPanel from "./notificationsPanel/notificationsPanel";
import FriendsPanel from "./friendsPanel/friendsPanel";
import ImportPanel from "./importEntries/importPanel";
import DaylioPanel from "./importEntries/daylioPanel";
import PixelsPanel from "./importEntries/pixelsPanel";

const SettingsStory = (props) => {
	const [popout, setPopout] = useState(null);
	const [modal, setModal] = useState(null);
	const [importCount, setImportCount] = useState(null);
	const [snackbar, setSnackbar] = useState(null);

	useEffect(() => {
		if (props.nav.activePanel !== "friends") setModal(null);
	}, [props.nav.activePanel]);

	return (
		<View
			id={props.id}
			popout={popout}
			modal={modal}
			activePanel={props.nav.activePanel}
			history={props.nav.panelHistory[props.id]}
			onSwipeBack={props.nav.goBack}
		>
			<Panel id="main">
				<PanelHeader separator={false}>Настройки</PanelHeader>
				<Group>
					<Cell
						expandable
						before={<Icon28Notifications />}
						onClick={() => {
							props.nav.goTo(props.id, "notifications");
						}}
					>
						Уведомления
					</Cell>
					<Cell
						expandable
						before={<Icon28PrivacyOutline />}
						onClick={() => {
							props.nav.goTo(props.id, "friends");
						}}
					>
						Доступ к статистике
					</Cell>
					<Cell
						expandable
						before={<Icon28UploadOutline />}
						onClick={() => {
							props.nav.goTo(props.id, "import");
						}}
					>
						Импорт записей
					</Cell>
				</Group>
				<Group>
					{process.env.NODE_ENV === "development" ? (
						<CellButton onClick={() => props.state.vkStorage.clear()}>
							Очистить VK Storage [DEV]
						</CellButton>
					) : null}
					<CellButton
						onClick={() => {
							bridge
								.send("VKWebAppShare", {})
								.then(() => window["yaCounter65896372"].reachGoal("appShared"));
						}}
					>
						Поделиться приложением
					</CellButton>
					<CellButton
						href="https://vk.com/club197288604"
						onClick={() => {
							window["yaCounter65896372"].reachGoal("groupVisit");
						}}
					>
						Перейти в группу ВК
					</CellButton>
				</Group>
				<Footer>Версия приложения v1.2.0</Footer>
			</Panel>
			<ImportPanel
				id="import"
				nav={props.nav}
				state={props.state}
				setPopout={setPopout}
				storyId={props.id}
				importCount={importCount}
				setImportCount={setImportCount}
				snackbar={snackbar}
				setSnackbar={setSnackbar}
			/>
			<DaylioPanel
				id="daylio"
				nav={props.nav}
				state={props.state}
				setPopout={setPopout}
				importCount={importCount}
				setImportCount={setImportCount}
				setSnackbar={setSnackbar}
			/>
			<PixelsPanel
				id="pixels"
				nav={props.nav}
				state={props.state}
				setPopout={setPopout}
				importCount={importCount}
				setImportCount={setImportCount}
				setSnackbar={setSnackbar}
			/>
			<NotificationsPanel
				id="notifications"
				nav={props.nav}
				state={props.state}
				setPopout={setPopout}
			/>
			<FriendsPanel
				id="friends"
				nav={props.nav}
				state={props.state}
				setPopout={setPopout}
				setModal={setModal}
			/>
		</View>
	);
};

export default SettingsStory;
