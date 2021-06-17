// react dependencies
import React, { useRef, useEffect } from 'react';

// internal components
import Card from './../Card';

// styles
import './UnoCard.scss';

const UnoCard = ({ children, className, content }) => {
	const ref = useRef(null);

	// https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element
	useEffect(() => {
		if (ref.current && ref.current.offsetWidth) {
			// console.log(ref.current);
			ref.current.parentNode.style.setProperty('--card-width', ref.current.offsetWidth);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ ref.current ]);

	return (
		<Card
			className={ `uno-card ${ className }` }
		>
			<div
				ref={ref}
			>
				<div className="uno-card__symbol uno-card__symbol--top">{ children }</div>
				<div className="uno-card__content">{ content }</div>
				<div className="uno-card__symbol uno-card__symbol--bottom">{ children }</div>
			</div>
		</Card>
	);
};

export default UnoCard;
