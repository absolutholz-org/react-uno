export function createDeckOfCards () {
	const cards = Array(4)
		.fill({ name: 'wild' })
		.map((wildCard, index) => ({ ...wildCard, id: `wild-${ index }` }));

	[ 1, 2, 3, 4 ]
		.forEach((color) => {
			[ '1', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', '+1', '+2' ]
				.forEach((name, index) => {
					cards.push({
						color,
						name,
						id: `${color}-${name}-${index}`
					});
				});
		});

	return cards;
}

export function shuffleCards (cards) {
	return cards.sort(() => Math.random() - 0.5);
}

export function dealCards (cards, playerCount = 2, cardsPerPlayer = 6) {
	if (playerCount * cardsPerPlayer > cards.length) {
		throw new Error(`Not enough cards (${ cards.length }) to give each player (${ playerCount }) ${ cardsPerPlayer } cards.`);
	}

	const dealtCards = new Array(playerCount);
	const remainingCards = [ ...cards ];

	for (let iPlayer = 0; iPlayer < playerCount; iPlayer+=1) {
		dealtCards[iPlayer] = remainingCards.splice(0, cardsPerPlayer);
	}

	return {
		dealtCards,
		remainingCards,
	};
}

export function takeCardsFromDeck (cards, cardCount = 1) {
	const cardsTaken = cards.splice(0, cardCount);
	return {
		remainingCards: cards,
		cardsTaken
	};
}

export function randomizePlayerOrder (players) {
	return players.sort(() => Math.random() - 0.5);
}
