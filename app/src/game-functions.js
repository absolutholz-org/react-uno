import { shuffle } from './array-functions';

export function createDeck () {
	const deck = Array(4).fill({ value: 'wild' }).map((wildCard, index) => ({ ...wildCard, id: `wild-${ index }` }));

	[ 'red', 'green', 'yellow', 'blue' ]
		.forEach((color) => {
			[ '1', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', '+1', '+2' ]
				.forEach((name, index) => {
					deck.push({
						color,
						name,
						id: `${color}-${name}-${index}`
					});
				});
		});

	return deck;
}

export function shuffleCards (cards) {
	return shuffle(cards);
}

export function dealCards (playerCount, cards, cardsPerPlayer = 6) {
	if (playerCount * cardsPerPlayer > cards.length) {
		throw new Error(`Not enough cards (${ cards.length }) to give each player (${ playerCount }) ${ cardsPerPlayer } cards.`);
	}

	const dealtCards = new Array(playerCount);
	const deck = [ ...cards ];

	for (let iPlayer = 0; iPlayer < playerCount; iPlayer+=1) {
		dealtCards[iPlayer] = deck.splice(0, cardsPerPlayer);
	}

	return {
		dealtCards,
		deck,
	};
}
