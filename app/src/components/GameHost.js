// react dependencies
import React, { useEffect } from 'react';

// external dependencies
import { usePubNub } from 'pubnub-react';

// internal scripts
import { createDeck, shuffleCards, dealCards } from './../game-functions';

// internal components
import { ACTION_DEAL, ACTION_GAME_START } from './../pages/Game';
import GamePlayer from './GamePlayer';

const GameHome = ({ name, id, gameChannel, players }) => {
	const pubNub = usePubNub();
	const fullCardDeck = createDeck();

	function deal () {
		const { dealtCards, remainingCards } = dealCards(players.length, shuffleCards(fullCardDeck), 6);

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

		pubNub
			.publish({
				channel: gameChannel,
				message: {
					action: ACTION_GAME_START,
					deck: remainingCards,
					players: players.map((player, index) => {
						player.cardCount = 6;
						player.isCurrent = index === 0;
						player.isNext = index === 1;
						return player;
					}),
				},
			});
	}

	let waitingForOccupants = [ ...players ].filter((occupant) => occupant.uuid !== id);

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
				if (message.message.action === ACTION_GAME_START) {

				}
			},
			presence: (message) => {
				console.log('HOST presence listener', { message });
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
			players={ players }
		/>
	);
};

export default GameHome;
