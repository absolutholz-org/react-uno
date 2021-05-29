// react dependencies
import React, { useState, useEffect, useMemo } from 'react';

// external dependencies
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';

// internal scripts
import { createDeck, shuffleCards, dealCards } from './../game-functions';

// internal components
// import GameHost from './../components/GameHost';
// import GameGuest from './../components/GameGuest';
import PlayerPreviewList from '../components/PlayerPreviewList';
// import PlayerCards from './../components/PlayerCards';

const ACTION_DEAL = 'deal';

const Game = ({ match: { params: { gameId } } }) => {
	const gameChannel = `uno-game-${ gameId }`;
	const playerId = window.sessionStorage.getItem(`uno-game-player-id-${ gameId }`);
	const playerChannel = `${ gameChannel }-${ playerId }`;
	const config = JSON.parse(window.sessionStorage.getItem(`uno-game-config-${ gameId }`));
	const isHost = playerId === config.players[0].uuid;

	const [ players, setPlayers ] = useState([ ...config.players ].map((player) => {
		return { ...player, cards: [] };
	}));
	const [ deck, setDeck ] = useState([]);

	const fullCardDeck = createDeck();

	function deal () {
		const { dealtCards, deck } = dealCards(players.length, shuffleCards(fullCardDeck), 6);
		setDeck(deck);
		const playersClone = [ ...players ].map((player, index) => {
			return { ...player, cards: dealtCards[index] };
		});

		// setPlayers([ ...players ].map((player, index) => {
		// 	return { ...player, cards: dealtCards[index] };
		// }));

		pubNub
			.publish({
				channel: gameChannel,
				message: {
					action: ACTION_DEAL,
					deck,
				},
			});

		playersClone.forEach((player) => {
			pubNub
				.publish({
					channel: `${ gameChannel }-${ player.uuid }`,
					message: {
						action: ACTION_DEAL,
						cards: player.cards,
					},
				});
		});
	}

	const pubNub = useMemo(() => new PubNub({
		publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
		subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
		uuid: playerId,
	}), [ playerId ]);

	useEffect(() => {
		pubNub.addListener({
			message: (message) => {
				console.log('message listener', { message });
			},
			presence: (message) => {
				console.log('presence listener', { message });
			},
		});

		pubNub.subscribe({
			channels: [ gameChannel, playerChannel ],
			withPresence: true,
		});

		pubNub.hereNow({
			channels: [ gameChannel ],
			includeState: true,
		}).then((response) => {
			console.log('hereNow', { response });
			if (isHost) {
				deal();
			}
		});
	}, [ pubNub, gameChannel ]);

	console.log({ config, players }, config.players);

	// let gameCommponent = isHost ?
	// 	<GameHost
	// 		channel={ channel }
	// 		cards={ playerCards }
	// 		id={ player.uuid }
	// 		name={ player.name }
	// 	/> :
	// 	<GameGuest
	// 		channel={ channel }
	// 		cards={ playerCards }
	// 		id={ player.uuid }
	// 		name={ player.name }
	// 	/>;

	return (
		<PubNubProvider client={ pubNub }>
			Game { gameId }
			{/* { gameCommponent } */}
			<section>
				<h2>Cards</h2>
				<section>
					<h3>Deck</h3>
					{ deck.length }
				</section>
				{/* <section>
					<h3>Discarded</h3>
				</section> */}
			</section>
			<section>
				<h2>Players</h2>
				<PlayerPreviewList players={ players } />
			</section>
			{/* <section>
				<h3>Player: { player.name }</h3>
				<PlayerCards cards={ playerCards } />
			</section> */}
		</PubNubProvider>
	);
};

export default Game;
