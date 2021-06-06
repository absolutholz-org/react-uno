// react dependencies
import React from 'react';

// internal components
import UnoCardBack from './../UnoCardBack';

// styles
import './UnplayedCardPile.scss';

const UnplayedCardPile = ({ cards }) => {
	return (
		<ol className="unplayed-card-pile" reversed>
			{
				cards.map((card, index, array) => (
					<li key={ card.id }>
						{ index === array.length - 1 &&
							<UnoCardBack />
						}
					</li>
				))
			}
		</ol>
	);
};

export default UnplayedCardPile;
