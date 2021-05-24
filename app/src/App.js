// react dependencies
import React from 'react';

// external dependencies
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';

// internal components
import Home from './pages/Home';

// styles
import './scss/global.scss';

let uuid = localStorage.getItem('pubnub_uuid');
if (!uuid) {
	uuid = PubNub.generateUUID();
	localStorage.setItem('pubnub_uuid', uuid);
}

const pubnub = new PubNub({
	publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
	subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
	uuid: uuid,
});

const App = () => {
	return (
		<PubNubProvider client={pubnub}>
			<Home />
		</PubNubProvider>
	);
};

export default App;
