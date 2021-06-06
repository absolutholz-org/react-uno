// react dependencies
import React, { useState, useEffect } from 'react';

// external dependencies
import { usePubNub } from 'pubnub-react';

// internal scripts

// internal components
import { ACTION_DEAL, ACTION_GAME_START, ACTION_TURN_CHANGE, ACTION_GAME_END } from './../pages/Game';
import PlayerPreviewList from './PlayerPreviewList';
import UnoCardPiles from './UnoCardPiles';
import VisuallyHidden from './VisuallyHidden';

const GameGuest = ({ name, id, gameChannel, players }) => {
	const playerChannel = `${ gameChannel }-${ id }`;
	const pubNub = usePubNub();

	const [ unplayedCards, setUnplayedCards ] = useState([]);
	const [ playedCards, setPlayedCards ] = useState([]);

	const [ cards, setCards ] = useState([]);
	const [ playerPreviews, setPlayerPreviews ] = useState(players);

	const [ isCurrentPlayer, setIsCurrentPlayer ] = useState(false);
	const [ isPlayedCardsEmpty, setIsPlayedCardsEmpty ] = useState(true);

	const [ lastPlayedColor, setLastPlayedColor ] = useState(null);
	const [ lastPlayedName, setLastPlayedName ] = useState(null);

	const [ cardsToDraw, setCardsToDraw ] = useState(0);

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
		const card = takeCardFromDeck(1)[0];
		// const card = { name:'wild', id: 'asdf1234' };
		// const card = { name:'+2', color: '1', id: 'asdf1234' };
		// const card = { name:'skip', color: '1', id: 'asdf1234' };
		playCard(card);

		if (card.name === 'skip') {
			endTurn(playerPreviews, [ card ], cards);

		} else if (card.name === '+1') {
			setCards((cards) => [ ...cards, ...takeCardFromDeck(1) ]);

		} else if (card.name === '+2') {
			setCards((cards) => [ ...cards, ...takeCardFromDeck(2) ]);
		}
	}

	function startTurn (players, unplayedCards, playedCards = []) {
		const isCurrent = (players.find((player) => player.isCurrent)).uuid === id;
		setIsCurrentPlayer(isCurrent);
		setPlayerPreviews(players);
		setPlayedCards(playedCards);
		setUnplayedCards(unplayedCards);
	}

	function endTurn (players, playedCards, cardsClone, skip = false) {
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

	function endGame () {
		pubNub
			.publish({
				channel: gameChannel,
				message: {
					action: ACTION_GAME_END,
					players: [ ...players ].map((player) => {
						player.isWinner = player.uuid === id;
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

	useEffect(() => {
		if (cards.length && cardsToDraw) {
			console.log(`player ${ id } takes ${ cardsToDraw } card`);
			setCards((cards) => [ ...cards, ...takeCardFromDeck(cardsToDraw) ]);
			setCardsToDraw(0);
		}
	}, [ cards, cardsToDraw ]);

	useEffect(() => {
		pubNub.addListener({
			message: (message) => {
				if (message.message.action === ACTION_DEAL && message.channel === playerChannel) {
					console.log('PLAYER message listener', { message });
					setCards(message.message.cards);
				}

				if (message.channel === gameChannel) {
					if (message.message.action === ACTION_TURN_CHANGE) {
						console.log('TURN message listener', { message });
						const { players, playedCards, unplayedCards } = message.message;
						startTurn(players, unplayedCards, playedCards);

						if ((players.find((player) => player.isCurrent)).uuid === id) {
							if (playedCards[playedCards.length - 1].name === '+1') {
								console.log(`player ${ id } takes 1 card`);
								setCardsToDraw(1);

							} else if (playedCards[playedCards.length - 1].name === '+2') {
								console.log(`player ${ id } takes 2 cards`);
								setCardsToDraw(2);
							}
						}

					} else if (message.message.action === ACTION_GAME_START) {
						console.log('GAME message listener', { message });
						let { deck, players } = message.message;
						startTurn(players, deck, []);

					} else if (message.message.action === ACTION_GAME_END) {
						console.log('GAME won!');
						const { players } = message.message;

						setIsCurrentPlayer(false);

						const winningPlayer = players.find((player) => player.isWinner);
						if (winningPlayer.uuid === id) {
							alert('Congratulations, you won!');
						} else {
							alert('Sorry, you lost.');
						}
					}
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

		if (cardsClone.length) {
			endTurn(playerPreviews, [ ...playedCards, card ], cardsClone, card.name === 'skip');
		} else {
			endGame();
		}
	}

	return (
		<section id={ id }>
			<section>
				<VisuallyHidden>
					<h3>Deck of Cards</h3>
				</VisuallyHidden>
				<UnoCardPiles
					unplayedCards={ unplayedCards }
					playedCards={ playedCards }
				/>
				{ isPlayedCardsEmpty &&
					<button
						disabled={ !isCurrentPlayer }
						onClick={ drawFirstCardOfGame }
					>Start the game</button>
				}
				{ !isPlayedCardsEmpty &&
					<button
						disabled={ !isCurrentPlayer || isPlayedCardsEmpty }
						onClick={ drawCard }
					>Draw a card</button>
				}
			</section>
			<section>
				<h3>Player Cards</h3>
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
