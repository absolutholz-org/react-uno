// react dependencies
import React from 'react';

// internal components
import UnoCardFront from './../UnoCardFront';

// styles
import './PlayedCardPile.scss';

const PlayedCardPile = ({ cards }) => {
	return (
		<ol className="played-card-pile">
			{
				cards.map((card) => (
					<li key={ card.id }>
						<UnoCardFront
							cardType={ card.name }
							cardColor={ card.color }
						/>
					</li>
				))
			}
		</ol>
	);
};

export default PlayedCardPile;
