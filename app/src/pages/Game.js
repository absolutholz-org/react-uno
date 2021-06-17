// react dependencies
import React, { useMemo, useState, useEffect } from 'react';
import swal from '@sweetalert/with-react';

// external dependencies
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';

// internal scripts
import { /*createDeckOfCards, shuffleCards, dealCards, */randomizePlayerOrder } from './../game-functions';


// internal components
import GameHost from '../components/GameHost';
// import GamePlayer from './../components/GamePlayer';
import { objectifyUuid } from './../pages/Lobby';
import { LayoutWidthContainer } from './../components/Layout';
import PlayerPreviewList from './../components/PlayerPreviewList';

export const ACTION_DEAL = 'deal';
export const ACTION_GAME_START = 'start-game';
export const ACTION_GAME_END = 'end-game';
export const ACTION_TURN_CHANGE = 'card-played';

const Game = ({ match: { params: { gameId } } }) => {
	const gameChannel = `uno-game-${ gameId }`;
	const config = JSON.parse(window.sessionStorage.getItem(`uno-game-config-${ gameId }`));
	const player = objectifyUuid(window.sessionStorage.getItem(`uno-game-player-id-${ gameId }`));
	const isHost = player.uuid === config.players[0].uuid;

	const [ players/*, setPlayers*/ ] = useState(randomizePlayerOrder([ ...config.players ]));

	// const [ unplayedCards, setUnplayedCards ] = useState(shuffleCards([ ...deckOfCards ]));
	// const [ playedCards, setPlayedCards ] = useState([]);

	// const [ playersNotYetPresent, setPlayersNotYetPresent ] = useState([ ...config.players ].filter((occupant) => occupant.uuid !== player.id));
	// const [ isAllPlayersPresent, setIsAllPlayersPresent ] = useState(playersNotYetPresent === 0);

	// function setPlayerArrived (playerId) {
	// 	setPlayersNotYetPresent([ ...playersNotYetPresent ].filter((player) => player.uuid !== playerId));
	// }

	// useEffect(() => {
	// 	setIsAllPlayersPresent(playersNotYetPresent.length === 0);
	// }, [ playersNotYetPresent ]);

	const pubNub = useMemo(() => new PubNub({
		publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
		subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
		uuid: player.uuid,
	}), [ player.uuid ]);

	useEffect(() => {
		swal({
			button: false,
			content: (
				<div>Waiting for other players</div>
			),
			closeOnEsc: false,
			closeOnClickOutside: false,
		});
	}, []);

	// useEffect(() => {
	// 	pubNub.addListener({
	// 		presence: (message) => {
	// 			if (message.action === 'join' && message.channel === gameChannel) {
	// 				console.log('Player joined', { message });
	// 				const { uuid } = message;
	// 				setPlayerArrived(uuid);

	// 				// if (isRoomFullyOccupied(joiningPlayerUuid)) {
	// 				// 	setPlayers(randomizePlayerOrder([ ...players ]));
	// 				// 	swal.close();
	// 				// }

	// 			}
	// 		},
	// 	});

	pubNub.subscribe({
		channels: [ gameChannel ],
		withPresence: true,
	});

	// 	pubNub.hereNow({
	// 		channels: [ gameChannel ],
	// 		// includeState: true,
	// 	}).then((response) => {
	// 		console.log('hereNow', { response });
	// 		if (response.channels[gameChannel]) {
	// 			response.channels[gameChannel].occupants.forEach((occupant) => {
	// 				setPlayerArrived(occupant.uuid);

	// 				// isRoomFullyOccupied(occupant.uuid);
	// 			});
	// 		}
	// 	});
	// }, [ pubNub, gameChannel ]);

	// // use host and guest system instead of all logic here, because only one user needs to create and have this data
	// let gameComponent = isHost ?
	// 	<GameHost
	// 		gameChannel={ gameChannel }
	// 		id={ player.uuid }
	// 		name={ player.name }
	// 		players={ config.players }
	// 	/> :
	// 	<GamePlayer
	// 		gameChannel={ gameChannel }
	// 		id={ player.uuid }
	// 		name={ player.name }
	// 		players={ config.players }
	// 	/>;

	return (
		<PubNubProvider client={ pubNub }>
			<LayoutWidthContainer>
				{/* Game { gameId } */}
				{/* { gameComponent } */}

				{ isHost &&
					<GameHost
						gameChannel={ gameChannel }
						id={ player.uuid }
						name={ player.name }
						players={ config.players }
					/>
				}
				{/* { !isHost &&
					<GamePlayer />
				} */}

				<PlayerPreviewList players={ players } />

			</LayoutWidthContainer>
		</PubNubProvider>
	);
};

export default Game;
