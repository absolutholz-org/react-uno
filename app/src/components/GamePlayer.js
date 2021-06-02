// react dependencies
import React, { useState, useEffect } from 'react';

// external dependencies
import { usePubNub } from 'pubnub-react';

// internal scripts

// internal components
import { ACTION_DEAL, ACTION_GAME_START, ACTION_TURN_CHANGE, ACTION_PLAYER_SKIP } from './../pages/Game';
import PlayerPreviewList from './PlayerPreviewList';

const GameGuest = ({ name, id, gameChannel, players }) => {
	const playerChannel = `${ gameChannel }-${ id }`;
	const pubNub = usePubNub();

	const [ unplayedCards, setUnplayedCards ] = useState([]);
	const [ playedCards, setPlayedCards ] = useState([]);

	const [ cards, setCards ] = useState([]);
	const [ playerPreviews, setPlayerPreviews ] = useState(players);

	const [ isCurrentPlayer, setIsCurrentPlayer ] = useState(false);
	const [ isPlayedCardsEmpty, setIsPlayedCardsEmpty ] = useState(true);
	const [ isPlayableCardAvailable, setIsPlayableCardAvailable ] = useState(false);

	const [ lastPlayedColor, setLastPlayedColor ] = useState(null);
	const [ lastPlayedName, setLastPlayedName ] = useState(null);

	const [ cardsDrawnThisTurn, setCardsDrawnThisTurn ] = useState(0);

	function chooseColor () {
		const colors = [ 'red', 'yellow', 'blue', 'green' ];
		const color = prompt(`Choose a color: ${ colors.join(', ') }`);
		if (colors.indexOf(color) > -1) {
			return color;
		} else {
			return chooseColor();
		}
	}

	function takeCardFromDeck (cardCount = 1) {
		const cardsClone = [ ...unplayedCards ];
		const cardsTaken = cardsClone.splice(0, cardCount);
		setUnplayedCards(cardsClone);
		return cardsTaken;
	}

	function playCard (card) {
		setPlayedCards((playedCards) => [ ...playedCards, card ]);
	}

	function drawCard () {
		setCards((cards) => [ ...cards, ...takeCardFromDeck(1) ]);
	}

	function drawFirstCardOfGame () {
		// const card = takeCardFromDeck(1)[0];
		const card = { name:'skip', color: 'red', id: 'asdf1234' };
		playCard(card);
		if (card.name === 'skip') {
			endTurn(playerPreviews, [ card ], cards);

		}
	}

	function startTurn (players, unplayedCards, playedCards = []) {
		const isCurrent = (players.find((player) => player.isCurrent)).uuid === id
		setIsCurrentPlayer(isCurrent);
		setPlayerPreviews(players);
		setPlayedCards(playedCards);
		console.log({unplayedCards});
		setUnplayedCards(unplayedCards);
	}

	function endTurn (players, playedCards, cardsClone, skip = false) {
		// const currentPlayerIndex = players.findIndex((player) => player.isCurrent);
		let nextPlayerIndex = players.findIndex((player) => player.isNext);
		let newNextPlayerIndex = nextPlayerIndex < players.length - 1 ? nextPlayerIndex + 1 : 0;

		if (skip) {
			nextPlayerIndex = newNextPlayerIndex;
			newNextPlayerIndex = nextPlayerIndex < players.length - 1 ? nextPlayerIndex + 1 : 0;
		}

		pubNub
			.publish({
				channel: gameChannel,
				message: {
					action: ACTION_TURN_CHANGE,
					unplayedCards,
					playedCards,
					players: [ ...players ].map((player, index) => {
						if (player.uuid === id) {
							player.cardCount = cardsClone.length;
						}
						player.isCurrent = nextPlayerIndex === index;
						player.isNext = newNextPlayerIndex === index;
						return player;
					}),
				},
			});
	}

	useEffect(() => {
		setIsPlayedCardsEmpty(playedCards.length < 1);
		if (playedCards.length > 0) {
			const lastPlayedCard = playedCards[playedCards.length - 1];
			setLastPlayedColor(lastPlayedCard.color);
			setLastPlayedName(lastPlayedCard.name);
		}
	}, [ playedCards ]);

	// useEffect(() => {
	// 	setIsPlayedCardsEmpty(playedCards.length < 1);
	// 	if (playedCards.length > 0) {
	// 		// const lastPlayedCard = playedCards[playedCards.length - 1];
	// 		// setLastPlayedColor(lastPlayedCard.color);
	// 		// setLastPlayedName(lastPlayedCard.name);

	// // 		if (isCurrentPlayer) {
	// // 			if (lastPlayedCard.name === 'skip') {
	// // 				console.log(`skip player ${ id }`);

	// // 				const nextPlayerIndex = playerPreviews.findIndex((player) => player.isNext);
	// // 				const newNextPlayerIndex = nextPlayerIndex < playerPreviews.length - 1 ? nextPlayerIndex + 1 : 0;

	// // 				pubNub
	// // 					.publish({
	// // 						channel: gameChannel,
	// // 						message: {
	// // 							action: ACTION_PLAYER_SKIP,
	// // 							players: [ ...playerPreviews ].map((player, index) => {
	// // 								player.isCurrent = nextPlayerIndex === index;
	// // 								player.isNext = newNextPlayerIndex === index;
	// // 								return player;
	// // 							}),
	// // 							skipPlayerId: id,
	// // 						},
	// // 					});

	// // 			} else if (lastPlayedCard.name === '+1') {
	// // 				console.log(`player ${ id } takes 1 card`);
	// // 				setCards((cards) => [ ...cards, ...takeCardFromDeck(1) ]);

	// // 			} else if (lastPlayedCard.name === '+2') {
	// // 				console.log(`player ${ id } takes 2 cards`);
	// // 				setCards((cards) => [ ...cards, ...takeCardFromDeck(2) ]);
	// // 			}
	// // 		}
	// 	}
	// }, [ playedCards ]);

	// useEffect(() => {
	// 	setIsPlayableCardAvailable(lastPlayedName === 'wild' || cards.some((card) => card.color === lastPlayedColor || card.name === lastPlayedName || card.name === 'wild'));
	// }, [ cards, lastPlayedColor, lastPlayedName ]);

	useEffect(() => {
		pubNub.addListener({
			message: (message) => {
				if (message.message.action === ACTION_DEAL && message.channel === playerChannel) {
					console.log('PLAYER message listener', { message });
					setCards(message.message.cards);
				}

				if (message.channel === gameChannel) {
					if (message.message.action === ACTION_TURN_CHANGE) {
						console.log('CARD message listener', { message });
						const { players, playedCards, unplayedCards } = message.message;
						// if (!skip) {
							startTurn(players, unplayedCards, playedCards);
						// } else {
						// 	if ((players.find((player) => player.isCurrent)).uuid === id) {
						// 		skipTurn(players, playedCards);
						// 	}
						// }
					}

					if (message.message.action === ACTION_GAME_START) {
						console.log('GAME message listener', { message });
						let { deck, players } = message.message;
						startTurn(players, deck, []);
					}

					// if (message.message.action === ACTION_PLAYER_SKIP) {
					// 	console.log('SKIP message listener', { message });
					// 	const { players, skipPlayerId } = message.message;
					// 	startTurn(players, unplayedCards, playedCards);
				}
			},
		});

		pubNub.subscribe({ channels: [ gameChannel, playerChannel ] });
	}, [ pubNub, gameChannel, playerChannel ]);

	function onCardClicked (card) {
		console.log({ card, lastPlayedColor, lastPlayedName });

		if (!isCurrentPlayer) {
			return false;
		}

		// if the first player draws a wild to begin the game, it has no color, and this is ok
		if (lastPlayedColor) {
			if (
				card.name !== 'wild' &&
				card.color !== lastPlayedColor &&
				card.name !== lastPlayedName
			) {
				alert('nope');
				return false;
			}
		}

		if (card.name === 'wild') {
			card.color = chooseColor();
		}

		const cardsClone = [ ...cards ].filter((cardClone) => cardClone.id !== card.id);
		playCard(card);
		setCards(cardsClone);
		endTurn(playerPreviews, [ ...playedCards, card ], cardsClone, card.name === 'skip');
	}

	return (
		<section id={ id }>
			<h3>{ name }</h3>
			<section>
				<h4>Deck of Cards</h4>
				<h5>Deck ({ unplayedCards.length })</h5>
				<h5>Current ({ playedCards.length })</h5>
				<ol>
					{
						playedCards.map((card) => (
							<li key={ card.id }>
								{ card.color } { card.name }
							</li>
						))
					}
				</ol>
				{ isPlayedCardsEmpty &&
					<button
						disabled={ !isCurrentPlayer }
						onClick={ drawFirstCardOfGame }
					>Start the game</button>
				}
				{ !isPlayedCardsEmpty &&
					<button
						disabled={ cardsDrawnThisTurn > 0 || !isCurrentPlayer || isPlayableCardAvailable || isPlayedCardsEmpty }
						onClick={ drawCard }
					>Draw a card</button>
				}
			</section>
			<section>
				<h4>Player Cards</h4>
				<ul>
					{
						cards.map((card) => (
							<li key={ card.id }>
								<button
									disabled={ !isCurrentPlayer || isPlayedCardsEmpty }
									id={ card.id }
									onClick={ () => onCardClicked(card) }
								>
									{ card.color } { card.name }
								</button>
							</li>
						))
					}
				</ul>
			</section>
			<section>
				<h4>Players</h4>
				<PlayerPreviewList
					players={ playerPreviews }
				/>
			</section>
		</section>
	);
};

export default GameGuest;
