// react dependencies
import React from 'react';

// internal components
import { ReactComponent as SvgCards } from '@mdi/svg/svg/cards.svg';

// styles
import './PlayerPreview.scss';

const PlayerPreview = ({ name, cardCount, isCurrent, isNext }) => {
	return (
		<section className={ `player-preview ${ isCurrent ? 'player-preview--current' : '' } ${ isNext ? 'player-preview--next' : '' }` }>
			{ isCurrent &&
				<div className="player-preview__turn-marker">Current</div>
			}
			{ isNext &&
				<div className="player-preview__turn-marker">Next</div>
			}
			<h3 className="player-preview__hdln">{ name }</h3>
			<div><SvgCards /> { cardCount }</div>
		</section>
	);
};

export default PlayerPreview;
