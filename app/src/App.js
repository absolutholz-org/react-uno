// react dependencies
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// internal components
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Game from './pages/Game';

// styles
import './scss/global.scss';

const App = () => {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={ Home } />
				<Route path="/lobby/:lobbyId" component={ Lobby } />
				<Route path="/game/:gameId" component={ Game } />
			</Switch>
		</Router>
	);
};

export default App;
