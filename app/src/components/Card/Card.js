// react dependencies
import React from 'react';

// styles
import './Card.scss';

const Card = ({ children, className }) => {
	return (
		<div className={ `card ${ className }` }>
			{ children }
		</div>
	);
};

export default Card;
