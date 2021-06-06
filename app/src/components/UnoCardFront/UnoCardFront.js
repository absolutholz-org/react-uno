// react dependencies
import React from 'react';

// internal components
import UnoCard from './../UnoCard';

// styles
import './UnoCardFront.scss';

const UnoCardFront = ({ cardType, cardColor }) => {
	const backgroundClass = cardColor ? ` uno-card--color-${ cardColor }` : '';
	const typeClass = cardType === 'wild' ? ' uno-card--wild' : '';

	return (
		<UnoCard className={ `${ backgroundClass }${ typeClass }` }>
			{ cardType }
			{/* <div className={ `uno-card uno-card--${ modifier }${ value === 'wild' ? ' uno-card--wild' : '' }` }>
				<div className="uno-card__content">
					<div className="uno-card__symbol uno-card__symbol--top">{ value !== 'wild' ? value : '' }</div>
					<div className="uno-card__symbol uno-card__symbol--bottom">{ value !== 'wild' ? value : '' }</div>
				</div>
			</div> */}
		</UnoCard>
	);
};

export default UnoCardFront;
