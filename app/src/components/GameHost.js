// react dependencies
import React, { useState, useEffect } from 'react';

// external dependencies
import { usePubNub } from 'pubnub-react';

// // internal scripts
import { createDeckOfCards, shuffleCards, dealCards } from '../game-functions';

// // internal components
import { ACTION_DEAL } from '../pages/Game';
// import GamePlayer from './GamePlayer';

const GameHome = ({
	gameChannel,
	id,
	name,
	players,
	fnNotifyAllPlayersPresent
}) => {
	const pubNub = usePubNub();
	const otherPlayers = [ ...players ].filter((occupant) => occupant.uuid !== id);

	const [ playersNotPresent, setPlayersNotPresent ] = useState([ otherPlayers ]);
	const deckOfCards = createDeckOfCards();

	function deal () {
		const { dealtCards/*, remainingCards*/ } = dealCards(shuffleCards([ ...deckOfCards ]), players.length, 6);

		players.forEach((player, index) => {
			pubNub
				.publish({
					channel: `${ gameChannel }-${ player.uuid }`,
					message: {
						action: ACTION_DEAL,
						cards: dealtCards[index],
					},
				});

		// 	pubNub
		// 		.publish({
		// 			channel: gameChannel,
		// 			message: {
		// 				action: ACTION_GAME_START,
		// 				deck: remainingCards,
		// 				players: players.map((player, index) => {
		// 					player.cardCount = 6;
		// 					player.isCurrent = index === 0;
		// 					player.isNext = index === 1;
		// 					return player;
		// 				}),
		// 			},
		// 		});

		});
	}

	function setPlayerArrived (playerId) {
		setPlayersNotPresent([ ...playersNotPresent ].filter((player) => player.uuid !== playerId));
	}

	useEffect(() => {
		if (playersNotPresent.length === 0) {
			deal();
		}
		// https://stackoverflow.com/questions/66184294/react-react-hook-useeffect-has-a-missing-dependency
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ playersNotPresent ]);

	useEffect(() => {
		pubNub.addListener({
			presence: (message) => {
				if (message.action === 'join' && message.channel === gameChannel) {
					console.log('Player joined', { message });
					setPlayerArrived(message.uuid);
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
					setPlayerArrived(occupant.uuid);
				});
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ pubNub, gameChannel ]);



// https://www.benmvp.com/blog/helper-functions-react-useeffect-hook/






	// const fullCardDeck = createDeckOfCards();

	// function deal () {
	// 	const { dealtCards, remainingCards } = dealCards(players.length, shuffleCards(fullCardDeck), 6);

	// 	players.forEach((player, index) => {
	// 		pubNub
	// 			.publish({
	// 				channel: `${ gameChannel }-${ player.uuid }`,
	// 				message: {
	// 					action: ACTION_DEAL,
	// 					cards: dealtCards[index],
	// 				},
	// 			});
	// 		});

	// 	pubNub
	// 		.publish({
	// 			channel: gameChannel,
	// 			message: {
	// 				action: ACTION_GAME_START,
	// 				deck: remainingCards,
	// 				players: players.map((player, index) => {
	// 					player.cardCount = 6;
	// 					player.isCurrent = index === 0;
	// 					player.isNext = index === 1;
	// 					return player;
	// 				}),
	// 			},
	// 		});
	// }

	// let waitingForOccupants = [ ...players ].filter((occupant) => occupant.uuid !== id);

	// function checkOccupancy (occupantId) {
	// 	waitingForOccupants = waitingForOccupants.filter((occupant) => occupant.uuid !== occupantId);
	// 	if (waitingForOccupants.length === 0) {
	// 		deal();
	// 	}
	// 	console.log({ waitingForOccupants, occupantId });
	// }


	return (
		<div>asdf</div>
		// <GamePlayer
		// 	id={ id }
		// 	name={ name }
		// 	gameChannel={ gameChannel }
		// 	players={ players }
		// />
	);
};

export default GameHome;
