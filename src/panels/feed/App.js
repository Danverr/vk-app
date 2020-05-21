import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

//import Home from './panels/Home';
//import Persik from './panels/Persik';
//import Load from './panels/Load';

/* 
 * 
		<View activePanel={activePanel} popout={popout}>
			<Home id='home' fetchedUser={fetchedUser} go={go} Date={props.Date}/>
			<Persik id='persik' go={go} />
			<Load id="load"/>
		</View>
 * 
 */

const App = (props) => {
	const [activePanel, /*setActivePanel*/] = useState('Feed');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	//const go = e => {
	//	setActivePanel(e.currentTarget.dataset.to);
	//};

	return (
		<div>

			</div>
	);

	//return (
	//	<View activePanel={activePanel} popout={popout}>
	//		<Home id='home' fetchedUser={fetchedUser} go={go} Date={props.Date} />
	//		<Persik id='persik' go={go} />
	//		<Load id="load" />
	//	</View>
	//	);

}

export default App;

