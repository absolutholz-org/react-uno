// react dependencies
import React from 'react';

// styles
import './VisuallyHidden.scss';

const VisuallyHidden = ({ children }) => {
	return (
		<div className="visually-hidden">{ children }</div>
	);
};

export default VisuallyHidden;

