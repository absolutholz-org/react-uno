import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

import { OutlinedButton } from '../Button/Button';

const ListStyle = styled.ol`
	display: grid;
	grid-gap: 1rem;
	list-style: none;
	padding-left: 0;
`;

const ListItemStyle = styled.li`

`;

const PlayerStyle = styled.div`
	border: 2px solid #ddd;
	border-radius: 4px;
	display: block;
	font: inherit;
	padding: 1rem;
	text-align: inherit;
	width: 100%;

	${ ({ vacancy }) =>
		vacancy
			? css`
				border: none;
				padding: 0;
			`
			: css``
	}
`;

const LobbyPlayerList = ({ players, lobbyId }) => {
	const [ emptyPositions, setEmptyPositions ] = useState(Array(4 - players.length).fill(''));

	useEffect(() => {
		setEmptyPositions(Array(4 - players.length).fill(''));
	}, [ players ]);

	const inviteOpponent = () => {
		const urlToShare = window.location.href.replace('?role=host', '');
		if (navigator.share) {
			navigator.share({
				url: urlToShare,
			});
		} else if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(urlToShare);
		} else {
			alert(`Share this room ID with your friend\r\n${ lobbyId }`);
		}
	};

	return (
		<ListStyle>
			{
				players.map((player) => (
					<ListItemStyle key={ player.uuid }>
						<PlayerStyle id={ player.uuid }>
							{ player.name }<br />
						</PlayerStyle>
					</ListItemStyle>
				))
			}
			{
				emptyPositions.map((emptyPosition, index) => (
					<ListItemStyle key={ `waiting-${ index }` }>
						<PlayerStyle
							onClick={ inviteOpponent }
							vacancy={ true }
							>
							<OutlinedButton>
								Click here to invite a friend to play
							</OutlinedButton>
						</PlayerStyle>
					</ListItemStyle>
				))
			}
		</ListStyle>
	);
};

export default LobbyPlayerList;
