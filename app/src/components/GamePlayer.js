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

	const [ cards, setCards ] = useState([]);
	const [ playerPreviews, setPlayerPreviews ] = useState(players);

	const [ isPlayedCardsEmpty, setIsPlayedCardsEmpty ] = useState(true);

	const [ isCurrentPlayer, setIsCurrentPlayer ] = useState(false);

	function takeCardFromDeck () {
		const cardsClone = [ ...unplayedCards ];
		const card = cardsClone.splice(0, 1);
		setPlayedCards((playedCards) => [ ...playedCards, card[0] ]);
		setUnplayedCards(cardsClone);
	}

	useEffect(() => {
		setIsPlayedCardsEmpty(playedCards.length < 1);
	}, [ playedCards ]);

	useEffect(() => {
		pubNub.addListener({
			message: (message) => {
				if (message.message.action === ACTION_DEAL && message.channel === playerChannel) {
					console.log('PLAYER message listener', { message });
					setCards(message.message.cards);
				}

				if (message.message.action === ACTION_CARD_PLAYED && message.channel === gameChannel) {
					const { players, playedCards, unplayedCards } = message.message;
					console.log('CARD message listener', { message });
					setPlayerPreviews(players);
					setIsCurrentPlayer((players.find((player) => player.isCurrent)).uuid === id);
					setPlayedCards(playedCards);
					setUnplayedCards(unplayedCards);
				}

				if (message.message.action === ACTION_GAME_START && message.channel === gameChannel) {
					const { deck, players } = message.message;
					console.log('GAME message listener', { message });
					setUnplayedCards(deck);
					setPlayerPreviews(players);
					setIsCurrentPlayer((players.find((player) => player.isCurrent)).uuid === id);
				}
			},
		});

		pubNub.subscribe({ channels: [ gameChannel, playerChannel ] });
	}, [ pubNub, gameChannel, playerChannel ]);

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
				<ol>
					{
						playedCards.map((card) => (
							<li key={ card.id }>
								{ card.color } { card.name }
							</li>
						))
					}
				</ol>
				<button
					disabled={ !isCurrentPlayer || !isPlayedCardsEmpty }
					onClick={ takeCardFromDeck }
				>Draw a card</button>
			</section>
			<section>
				<h4>Player Cards</h4>
				<ul>
					{
						cards.map((card) => (
							<li key={ card.id }>
								<button
									disabled={ isPlayedCardsEmpty }
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
