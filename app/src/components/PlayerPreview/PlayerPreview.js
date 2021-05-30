// react dependencies
import React from 'react';

// external dependencies

// internal scripts

// internal components
import { ReactComponent as SvgCards } from '@mdi/svg/svg/cards.svg';

const PlayerPreview = ({ name, cardCount, isCurrent, isNext }) => {
	return (
		<section className="player-preview">
			{ isCurrent &&
				<div>Current</div>
			}
			{ isNext &&
				<div>Next</div>
			}
			<h3>{ name }</h3>
			<div><SvgCards /> { cardCount }</div>
		</section>
	);
};

export default PlayerPreview;
