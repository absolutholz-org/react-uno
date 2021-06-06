// react dependencies
import React from 'react';

// styles
import './Card.scss';

const Card = ({ children }) => {
	return (
		<div className="card">
			{ children }
		</div>
	);
};

export default Card;
