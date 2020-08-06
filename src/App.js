import React, { useEffect } from "react";
import { Epic, Root, ConfigProvider } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import moment from "moment";

import useAppState from "./utils/useAppState";
import useNav from "./utils/useNav";

import GlobalErrorView from "./panels/globalError/globalErrorView";
import LoadingScreen from "./panels/loadingScreen/loadingScreen";
import IntroView from "./panels/intro/introView";

import ProfilesStory from "./panels/profiles/profilesStory";
import FeedStory from "./panels/feed/feedStory";
import CheckInStory from "./panels/checkIn/checkInStory";
import CalendarStory from "./panels/calendar/calendarStory";
import SettingsStory from "./panels/settings/settingsStory";

const startTime = moment();

const getTimeElapsed = (start) => {
	let ms = moment().diff(start);

	let s = Math.floor(ms / 1000);
	ms %= 1000;

	let m = Math.floor(s / 60);
	s %= 60;

	if (ms < 10) ms = "00" + m;
	else if (ms < 100) ms = "0" + ms;
	if (s < 10) s = "0" + s;
	if (m < 10) m = "0" + m;

	return `${m}:${s}:${ms}`;
};

const App = () => {
	console.group(getTimeElapsed(startTime));

	// Состояние и навигация приложения
	const state = useAppState();
	const nav = useNav();
	const { goBack } = nav;

	console.groupEnd();

	// Добавляем обработчик события изменения истории для работы аппаратных кнопок
	useEffect(() => {
		window.addEventListener("popstate", goBack);
	}, [goBack]);

	if (!state.loading) {
		if (state.globalError) nav.goTo("globalError");
		if (state.vkStorage.getValue("showIntro")) nav.goTo("intro");
	}

	return (
		<ConfigProvider isWebView>
			<Root activeView="Epic">
				<Epic
					id="Epic"
					className={nav.navbar ? "" : "hideNavbar"}
					activeStory={state.loading ? "loadingScreen" : nav.activeStory}
					tabbar={nav.navbar}
				>
					<GlobalErrorView
						id="globalError"
						error={state.globalError}
						state={state}
						nav={nav}
					/>
					<LoadingScreen id="loadingScreen" state={state} nav={nav} />
					<IntroView id="intro" state={state} nav={nav} />

					<FeedStory id="feed" state={state} nav={nav} />
					<ProfilesStory id="profiles" state={state} nav={nav} />
					<CheckInStory id="checkIn" state={state} nav={nav} />
					<CalendarStory id="calendar" state={state} nav={nav} />
					<SettingsStory id="settings" state={state} nav={nav} />
				</Epic>
			</Root>
		</ConfigProvider>
	);
};

export default App;
