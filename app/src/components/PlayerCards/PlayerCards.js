// react dependencies
import React from 'react';

// external dependencies

// internal scripts

// internal components

const PlayerCards = ({ cards }) => {
	return (
		<ol className="player-cards">
			{
				cards.map((card) => (
					<li key={ card.id }>
						{ card.name }
					</li>
				))
			}
		</ol>
	);
};

export default PlayerCards;
