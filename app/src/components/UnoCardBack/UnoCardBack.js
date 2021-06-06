// react dependencies
import React from 'react';

// internal components
import UnoCard from './../UnoCard';

// styles
import './UnoCardBack.scss';

const UnoCardBack = () => {
	return (
		<UnoCard
			className="uno-card--color-all"
			content="UNO!"
		>
			{/* <div className="uno-card-back">
				<div className="uno-card-back__content">
					<div className="uno-card-back__center-text">UNO!</div>
				</div>
			</div> */}
		</UnoCard>
	);
};

export default UnoCardBack;
