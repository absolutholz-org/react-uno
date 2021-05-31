// react dependencies
import React, { useState, useEffect } from 'react';

// external dependencies
import { usePubNub } from 'pubnub-react';

// internal scripts

// internal components
import { ACTION_DEAL, ACTION_GAME_START, ACTION_CARD_PLAYED } from './../pages/Game';
import PlayerPreviewList from './PlayerPreviewList';

const GameGuest = ({ name, id, gameChannel, players }) => {
	const playerChannel = `${ gameChannel }-${ id }`;
	const pubNub = usePubNub();

	const [ unplayedCards, setUnplayedCards ] = useState([]);
	const [ playedCards, setPlayedCards ] = useState([]);
	const [ lastPlayedCard, setLastPlayedCard ] = useState(null);
	const [ cards, setCards ] = useState([]);
	// const [ currentPlayerId, setCurrentPlayerId ] = useState(null);
	// const [ nextPlayerId, setNextPlayerId ] = useState(null);
	// const [ currentPlayer, setCurrentPlayer ] = useState(false);
	// const [ nextPlayer, setNextPlayer ] = useState(false);

	const [ playerPreviews, setPlayerPreviews ] = useState(players);

	// function takeCardFromDeck () {
	// 	const cardsClone = [ ...unplayedCards ];
	// 	const card = cardsClone.splice(0, 1);
	// 	console.log({ card, cardsClone, playedCards });
	// 	setPlayedCards((playedCards) => [ ...playedCards, card ]);
	// }

	// useEffect(() => {
	// 	if (unplayedCards.length) {
	// 		takeCardFromDeck();
	// 	}
	// }, [ unplayedCards ]);

	// useEffect(() => {
	// 	if (playedCards.length) {
	// 		setLastPlayedCard(playedCards[playedCards.length - 1]);
	// 		console.log(playedCards[playedCards.length - 1]);
	// 	}
	// }, [ playedCards ]);

	// function updatePlayerPreviews (players, currentPlayerId, nextPlayerId) {
	// 	setPlayerPreviews([ ...players ].map((player) => {
	// 		player.isCurrent = player.uuid === currentPlayerId;
	// 		player.isNext = player.uuid === nextPlayerId;
	// 		console.log({ player });
	// 		return player;
	// 	}));
	// }

	useEffect(() => {
		pubNub.addListener({
			message: (message) => {
				if (message.message.action === ACTION_DEAL && message.channel === playerChannel) {
					console.log('PLAYER message listener', { message });
					setCards(message.message.cards);
				}

				if (message.message.action === ACTION_CARD_PLAYED && message.channel === gameChannel) {
					const { players } = message.message;
					console.log('CARD message listener', { message });
					setPlayerPreviews(players);
				}

				if (message.message.action === ACTION_GAME_START && message.channel === gameChannel) {
					const { deck, players } = message.message;
					console.log('GAME message listener', { message }, id);
					setUnplayedCards(deck);
					// updatePlayerPreviews (players, currentPlayerId, nextPlayerId);
					setPlayerPreviews(players);
					// setCurrentPlayerId(currentPlayerId);
					// setNextPlayerId(nextPlayerId);
				}
			},
		});

		pubNub.subscribe({ channels: [ gameChannel, playerChannel ] });
	}, [ pubNub, gameChannel, playerChannel ]);

	// function getNextPlayer () {
	// 	const currentPlayerIndex = players.findIndex((player) => player.uuid === id);
	// 	const nextPlayerIndex = currentPlayerIndex < players.length - 1 ? currentPlayerIndex + 1 : 0;
	// 	return players[ nextPlayerIndex ];
	// }

	function onCardClicked (card) {
		console.log({ players, playerPreviews, card });

		const currentPlayerIndex = playerPreviews.findIndex((player) => player.isCurrent);
		const nextPlayerIndex = playerPreviews.findIndex((player) => player.isNext);
		const newNextPlayerIndex = nextPlayerIndex < playerPreviews.length - 1 ? nextPlayerIndex + 1 : 0;

		console.log({ currentPlayerIndex, nextPlayerIndex, newNextPlayerIndex });

		pubNub
			.publish({
				channel: gameChannel,
				message: {
					action: ACTION_CARD_PLAYED,
					unplayedCards,
					playedCards,
					players: [ ...playerPreviews ].map((player, index) => {
						if (player.uuid === id) {
							player.cardCount = cards.length;
						}
						player.isCurrent = nextPlayerIndex === index;
						player.isNext = newNextPlayerIndex === index;
						return player;
					}),
				},
			});
	}

	return (
		<section id={ id }>
			<h3>{ name }</h3>
			<section>
				<h4>Deck of Cards</h4>
				<h5>Deck ({ unplayedCards.length })</h5>
				<h5>Current ({ playedCards.length })</h5>
				{ lastPlayedCard &&
					<div>
						{ lastPlayedCard.color } -
						{ lastPlayedCard.name }
					</div>
				}
			</section>
			<section>
				<h4>Player Cards</h4>
				<ul>
					{
						cards.map((card) => (
							<li key={ card.id }>
								<button onClick={ () => onCardClicked(card) }>
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
