// react dependencies`
import React from 'react';

// internal components
import GamePlayer from './GamePlayer';

const GameGuest = ({ name, id, gameChannel, players }) => {
	return (
		<GamePlayer
			id={ id }
			name={ name }
			gameChannel={ gameChannel }
			players={ players }
		/>
	);
};

export default GameGuest;
