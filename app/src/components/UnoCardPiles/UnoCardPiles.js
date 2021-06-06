// react dependencies
import React from 'react';

// internal components
import PlayedCardPile from './../PlayedCardPile';
import UnplayedCardPile from './../UnplayedCardPile';
import UnoCardPlaceholder from './../UnoCardPlaceholder';
import VisuallyHidden from './../VisuallyHidden';

// styles
import './UnoCardPiles.scss';

const UnoCardPiles = ({ unplayedCards, playedCards }) => {
	return (
		<div className="uno-card-piles">
			<div className="uno-card-piles__unplayed-cards">
				<VisuallyHidden>
					<h4>Unplayed Cards</h4>
				</VisuallyHidden>
				<div className="uno-card-piles__pile">
					<div className="uno-card-piles__placeholder">
						<UnoCardPlaceholder />
					</div>
					<div className="uno-card-piles__cards">
						<UnplayedCardPile
							cards={ unplayedCards }
							/>
					</div>
				</div>
			</div>
			<div className="uno-card-piles__played-cards">
				<VisuallyHidden>
					<h4>Played Cards</h4>
				</VisuallyHidden>
				<div className="uno-card-piles__pile">
					<div className="uno-card-piles__placeholder">
						<UnoCardPlaceholder />
					</div>
					<div className="uno-card-piles__cards">
						<PlayedCardPile
							cards={ playedCards }
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UnoCardPiles;
