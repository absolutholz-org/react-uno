// react dependencies
import React from 'react';

// styles
import './UnoCard.scss';

const UnoCard = ({ value, modifier }) => {
	return (
		<div className={ `uno-card uno-card--${ modifier }` }>
			<div className="uno-card__content">
				<div className="uno-card__symbol uno-card__symbol--top">{ value }</div>
				<div className="uno-card__symbol uno-card__symbol--bottom">{ value }</div>
			</div>
		</div>
	);
};

export default UnoCard;
