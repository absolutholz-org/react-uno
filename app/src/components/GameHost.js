// react dependencies
import React, { useState, useEffect } from 'react';

// external dependencies
import { usePubNub } from 'pubnub-react';

// internal scripts
import { createDeck, shuffleCards, dealCards } from './../game-functions';

// internal components
import { ACTION_DEAL } from './../pages/Game';
import GamePlayer from './GamePlayer';

const GameHome = ({ name, id, gameChannel, players }) => {
	const pubNub = usePubNub();
	const fullCardDeck = createDeck();

	// const [ playersWithCards, setPlayersWithCards ] = useState([ ...players ].map((player) => {
	// 	return { ...player, cards: [] };
	// }));
	const [ deck, setDeck ] = useState([]);
	const [ cards, setCards ] = useState([]);

	let waitingForOccupants = [ ...players ].filter((occupant) => occupant.uuid !== id);

	function deal () {
		const { dealtCards, remainingCards } = dealCards(players.length, shuffleCards(fullCardDeck), 6);
		setDeck(remainingCards);
		players.forEach((player, index) => {
			pubNub
				.publish({
					channel: `${ gameChannel }-${ player.uuid }`,
					message: {
						action: ACTION_DEAL,
						cards: dealtCards[index],
					},
				});
		});
		console.log({ dealtCards, remainingCards });
	}

	function checkOccupancy (occupantId) {
		waitingForOccupants = waitingForOccupants.filter((occupant) => occupant.uuid !== occupantId);
		if (waitingForOccupants.length === 0) {
			deal();
		}
		console.log({ waitingForOccupants, occupantId });
	}

	useEffect(() => {
		pubNub.addListener({
			message: (message) => {
				console.log('message listener', { message });
				if (message.action === ACTION_DEAL) {
					setCards(cards);
				}
			},
			presence: (message) => {
				console.log('presence listener', { message });
				if (message.action === 'join' && message.channel === gameChannel) {
					checkOccupancy(message.uuid);
				}
			},
		});

		pubNub.subscribe({
			channels: [ gameChannel ],
			withPresence: true,
		});

		pubNub.hereNow({
			channels: [ gameChannel ],
			// includeState: true,
		}).then((response) => {
			console.log('hereNow', { response });
			if (response.channels[gameChannel]) {
				response.channels[gameChannel].occupants.forEach((occupant) => {
					checkOccupancy(occupant.uuid);
				});
			}
		});
	}, [ pubNub, gameChannel ]);

	return (
		<GamePlayer
			id={ id }
			name={ name }
			gameChannel={ gameChannel }
		/>
	);
};

export default GameHome;
