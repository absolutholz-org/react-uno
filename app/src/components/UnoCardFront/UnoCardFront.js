// react dependencies
import React from 'react';

// internal components
import UnoCard from './../UnoCard';
import UnoCardSymbolWild from './../UnoCardSymbolWild';

// styles
import './UnoCardFront.scss';

const UnoCardFront = ({ cardType, cardColor }) => {
	const backgroundClass = cardColor ? ` uno-card--color-${ cardColor }` : '';
	const typeClass = cardType === 'wild' ? ' uno-card--wild' : '';

	return (
		<UnoCard
			className={ `${ backgroundClass }${ typeClass }` }
			// content={ cardType }
		>
			{ cardType !== 'wild' && cardType !== 'skip' &&
				<span>{ cardType }</span>
			}
			{ cardType === 'wild' &&
				<UnoCardSymbolWild />
			}
			{ cardType === 'skip' &&
				<span>⊘</span>
			}
		</UnoCard>
	);
};

export default UnoCardFront;
