// react dependencies
import React, { useState, useEffect, useMemo } from 'react';

// external dependencies
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';

// internal scripts
// import { createDeck, shuffleCards, dealCards } from './../game-functions';

// internal components
import GameHost from './../components/GameHost';
import GameGuest from './../components/GameGuest';
// import PlayerPreviewList from '../components/PlayerPreviewList';
// import PlayerCards from './../components/PlayerCards';
import { objectifyUuid } from './../pages/Lobby';
import { LayoutWidthContainer } from './../components/Layout';

export const ACTION_DEAL = 'deal';

const Game = ({ match: { params: { gameId } } }) => {
	const gameChannel = `uno-game-${ gameId }`;
	const config = JSON.parse(window.sessionStorage.getItem(`uno-game-config-${ gameId }`));
	const player = objectifyUuid(window.sessionStorage.getItem(`uno-game-player-id-${ gameId }`));
	// console.log({ player });
	// const playerChannel = `${ gameChannel }-${ playerId }`;

	const isHost = player.uuid === config.players[0].uuid;

	// const [ players, setPlayers ] = useState([ ...config.players ].map((player) => {
	// 	return { ...player, cards: [] };
	// }));
	// const [ deck, setDeck ] = useState([]);

	// const fullCardDeck = createDeck();

	// function deal () {
	// 	const { dealtCards, deck } = dealCards(players.length, shuffleCards(fullCardDeck), 6);
	// 	setDeck(deck);
	// 	const playersClone = [ ...players ].map((player, index) => {
	// 		return { ...player, cards: dealtCards[index] };
	// 	});

	// 	// setPlayers([ ...players ].map((player, index) => {
	// 	// 	return { ...player, cards: dealtCards[index] };
	// 	// }));

	// 	pubNub
	// 		.publish({
	// 			channel: gameChannel,
	// 			message: {
	// 				action: ACTION_DEAL,
	// 				deck,
	// 			},
	// 		});

	// 	playersClone.forEach((player) => {
	// 		pubNub
	// 			.publish({
	// 				channel: `${ gameChannel }-${ player.uuid }`,
	// 				message: {
	// 					action: ACTION_DEAL,
	// 					cards: player.cards,
	// 				},
	// 			});
	// 	});
	// }

	const pubNub = useMemo(() => new PubNub({
		publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
		subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
		uuid: player.uuid,
	}), [ player.uuid ]);

	function checkOccupancy (response) {
		console.log({ response });
	}

	useEffect(() => {
	// 	pubNub.addListener({
	// 		message: (message) => {
	// 			console.log('message listener', { message });
	// 		},
	// 		presence: (message) => {
	// 			console.log('presence listener', { message });
	// 		},
	// 	});

	// 	pubNub.subscribe({
	// 		channels: [ gameChannel, playerChannel ],
	// 		withPresence: true,
	// 	});

		// pubNub.hereNow({
		// 	channels: [ gameChannel ],
		// 	includeState: true,
		// }).then((response) => {
		// 	console.log('hereNow', { response });
		// 	checkOccupancy(response);
		// 	// if (isHost) {
		// 	// 	deal();
		// 	// }
		// });
		// pubNub.hereNow({
		// 	channels: [ gameChannel ],
		// 	includeState: true,
		// }).then((response) => {
		// 	console.log('hereNow', { response });
		// });
	}, [ pubNub, gameChannel ]);

	// console.log({ config, players }, config.players);

	let gameComponent = isHost ?
		<GameHost
			gameChannel={ gameChannel }
			// cards={ playerCards }
			id={ player.uuid }
			name={ player.name }
			players={ config.players }
		/> :
		<GameGuest
			gameChannel={ gameChannel }
			// cards={ playerCards }
			id={ player.uuid }
			name={ player.name }
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
