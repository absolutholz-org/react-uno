import React from 'react';

const LobbyPlayerList = ({ players }) => {
	return (
		<ol>
		{
			players.map((player) => (
				<li key={ player.uuid }>{ player.name }<br /><small>{ player.uuid }</small></li>
			))
		}
	</ol>
);
};

export default LobbyPlayerList;
