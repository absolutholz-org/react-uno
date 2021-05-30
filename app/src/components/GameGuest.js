// react dependencies`
import React from 'react';

// internal components
import GamePlayer from './GamePlayer';

const GameGuest = ({ name, id, gameChannel }) => {
	return (
		<GamePlayer
			id={ id }
			name={ name }
			gameChannel={ gameChannel }
		/>
	);
};

export default GameGuest;
