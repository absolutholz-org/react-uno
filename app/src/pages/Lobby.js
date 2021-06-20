// react dependencies
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";

// external dependencies
import { nanoid } from 'nanoid';
import PubNub from 'pubnub';
import swal from '@sweetalert/with-react';

// internal components
import { LayoutWidthContainer } from './../components/Layout';
import LobbyPlayerList from './../components/LobbyPlayerList';
import { ContainedButton } from './../components/Button';
import CreatePlayerDialog from './../components/CreatePlayerDialog';

const MESSAGE_START_GAME = 'start-game';

export function objectifyUuid (uuid) {
	const splitId = uuid.split('||');
	const name = splitId[0];
	return {
		name,
		uuid,
	};
}

const Lobby = ({ match: { params: { lobbyId } } }) => {
	const [ pubNub, setPubNub ] = useState(null);
	const [ lobbyChannel ] = useState(`uno-lobby-${ lobbyId }`);
	const [ player, setPlayer ] = useState(null);
	const [ players, setPlayers ] = useState([]);
	const isCreator = new URLSearchParams(useLocation().search).get('role') === 'host';
	const history = useHistory();

	const startGame = () => {
		pubNub
			.publish({
				channel: lobbyChannel,
				message: {
					action: MESSAGE_START_GAME,
					channelId: nanoid(5),
					config: {
						players,
					},
				},
			});
	};

	// after player is created => initialize PubNub
	useEffect(() => {
		if (player) {
			console.log('init pubnub', { player });
			setPubNub(new PubNub({
				publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
				subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
				uuid: player.uuid,
			}));
		}
	}, [ player ]);

	// after PubNub is initialized => create Lobby; setup PubNub listeners
	useEffect(() => {
		if (pubNub) {
			console.log({ pubNub, lobbyChannel });

			pubNub.addListener({
				message: (message) => {
					console.log('message listener', { message });

					if (message.message.action === MESSAGE_START_GAME) {
						console.log(isCreator)
						window.sessionStorage.setItem(`uno-game-player-id-${ message.message.channelId }`, player.uuid);
						window.sessionStorage.setItem(`uno-game-config-${ message.message.channelId }`, JSON.stringify(message.message.config));
						window.sessionStorage.setItem(`uno-game-host-${ message.message.channelId }`, isCreator);
						history.push(`/game/${ message.message.channelId }`);
					}
				},
				presence: (message) => {
					console.log('presence listener', { message });

					if (message.action === 'join' && message.occupancy < 5) {
						setPlayers(players => [ ...players, objectifyUuid(message.uuid) ]);
					}
				},
			});

			pubNub.subscribe({
				channels: [ lobbyChannel ],
				withPresence: true,
			});

			pubNub.hereNow({
				channels: [ lobbyChannel ],
				includeState: true,
			}).then((response) => {
				console.log('hereNow', { response });

				if (response.totalOccupancy < 4) {
					response.channels[ lobbyChannel ].occupants
						// .filter((occupant) => pubnub.getUUID() !== occupant.uuid)
						.forEach((occupant) => {
							console.log({ occupant });
							setPlayers(players => [ ...players, objectifyUuid(occupant.uuid) ]);
						});
				} else {
					alert(`Sorry, this room's full.`);
					pubNub.unsubscribe({
						channels: [ lobbyChannel ],
						withPresence: true,
					});
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ pubNub, lobbyChannel, history ]);

	// Lobby is created; PubNub is available and player data has been entered => publish this information for other participants
	useEffect(() => {
		if (pubNub && player) {
			console.log('publish', { pubNub, player });
			pubNub
			.publish({
				channel: lobbyChannel,
				message: {
					player,
				},
			});
			// .then(() => setMessage(''));
		}
	}, [ pubNub, player, lobbyChannel ]);

	useEffect(() => {
		if (player === null) {
			swal({
				button: false,
				closeOnEsc: false,
				closeOnClickOutside: false,
				content: (
					<CreatePlayerDialog
						setPlayer={ setPlayer }
					/>
				),
			});
		} else {
			swal.close();
		}
	}, [ player ]);

	return (
		<LayoutWidthContainer>
			<h1>Game lobby</h1>

			{ isCreator &&
				<>
					<p>You are the host.</p>
					<p>When all players are present click the button below the list to start playing.</p>
				</>
			}

			<ContainedButton
				disabled={ !isCreator || players.length < 2 || players.length > 4 }
				onClick={ startGame }
			>Start the game</ContainedButton>

			<h2>Players</h2>
			<LobbyPlayerList
				lobbyId={ lobbyId}
				players={ players }
			/>

		</LayoutWidthContainer>
	);
};

export default Lobby;
