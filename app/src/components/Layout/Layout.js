import React from 'react';

import './Layout.scss';

export const LayoutWidthContainer = ({ children }) => {
	return (
		<>
			<div className="l-width-container">{ children }</div>
		</>
	);
};
