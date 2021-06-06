// react dependencies
import React from 'react';

// internal components
import UnoCardFront from './../UnoCardFront';

// styles
import './PlayerCards.scss';

const PlayerCards = ({ cards, onCardClicked }) => {
	return (
		<ul className="player-cards">
			{
				cards.map((card) => (
					<li key={ card.id }>
						<button
							className="player-cards__button"
							// disabled={ !isCurrentPlayer || isPlayedCardsEmpty }
							onClick={ () => onCardClicked(card) }
						>
							<UnoCardFront
								cardType={ card.name }
								cardColor={ card.color }
							/>
						</button>
					</li>
				))
			}
		</ul>
	);
};

export default PlayerCards;
