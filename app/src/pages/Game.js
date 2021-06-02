// react dependencies
import React, { useMemo } from 'react';

// external dependencies
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';

// internal scripts

// internal components
import GameHost from './../components/GameHost';
import GameGuest from './../components/GameGuest';
import { objectifyUuid } from './../pages/Lobby';
import { LayoutWidthContainer } from './../components/Layout';

export const ACTION_DEAL = 'deal';
export const ACTION_GAME_START = 'start-game';
export const ACTION_TURN_CHANGE = 'card-played';
export const ACTION_PLAYER_SKIP = 'skip-player';

const Game = ({ match: { params: { gameId } } }) => {
	const gameChannel = `uno-game-${ gameId }`;
	const config = JSON.parse(window.sessionStorage.getItem(`uno-game-config-${ gameId }`));
	const player = objectifyUuid(window.sessionStorage.getItem(`uno-game-player-id-${ gameId }`));

	const isHost = player.uuid === config.players[0].uuid;

	const pubNub = useMemo(() => new PubNub({
		publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
		subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
		uuid: player.uuid,
	}), [ player.uuid ]);

	// use host and guest system instead of all logic here, because only one user needs to create and have this data
	let gameComponent = isHost ?
		<GameHost
			gameChannel={ gameChannel }
			id={ player.uuid }
			name={ player.name }
			players={ config.players }
		/> :
		<GameGuest
			gameChannel={ gameChannel }
			id={ player.uuid }
			name={ player.name }
			players={ config.players }
		/>;

	return (
		<PubNubProvider client={ pubNub }>
			<LayoutWidthContainer>
				Game { gameId }
				{ gameComponent }
			</LayoutWidthContainer>
		</PubNubProvider>
	);
};

export default Game;
