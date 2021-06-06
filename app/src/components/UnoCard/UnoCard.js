// react dependencies
import React from 'react';

// internal components
import Card from './../Card';

// styles
import './UnoCard.scss';

const UnoCard = ({ children, className, content }) => {
	return (
		<Card>
			<div className={ `uno-card ${ className }` }>
				<div className="uno-card__symbol uno-card__symbol--top">{ children }</div>
				<div className="uno-card__content">{ content }</div>
				<div className="uno-card__symbol uno-card__symbol--bottom">{ children }</div>
			</div>
		</Card>
	);
};

export default UnoCard;
