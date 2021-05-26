// react dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

// external dependencies
import { nanoid } from 'nanoid';
import PubNub from 'pubnub';

// internal components
import { LayoutWidthContainer } from './../components/Layout';
import LobbyPlayerList from './../components/LobbyPlayerList';

const MESSAGE_START_GAME = 'start-game';

function objectifyUuid (uuid) {
	const splitId = uuid.split('_');
	const name = splitId[ splitId.length - 1 ];
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
	const [ isCreator, setIsCreator ] = useState(false);
	const history = useHistory();

// let uuid = localStorage.getItem('pubnub_uuid');
// if (!uuid) {
// 	uuid = PubNub.generateUUID();
// 	localStorage.setItem('pubnub_uuid', uuid);
// }

	const createPlayer = (event) => {
		event.preventDefault();
		const name = event.target.querySelector('#creator_name').value;
		const uuid = `${ nanoid(32) }_${ name }`;
		console.log('create player', {
			name,
			uuid,
		});
		setPlayer({
			name,
			uuid,
		});
	};

	const inviteOpponent = () => {
		if (navigator.share) {
			navigator.share({
				url: window.location.href,
			});
		} else if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(window.location.href);
		} else {
			alert(`Share this room ID with your friend\r\n${lobbyId}`);
		}
	};

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
						window.sessionStorage.setItem(`uno-game-config-${ message.message.channelId }`, JSON.stringify(message.message.config));
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

				if (response.totalOccupancy === 0) {
					setIsCreator(true);
				}

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
	}, [ pubNub, lobbyChannel ]);

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

	return (
		<LayoutWidthContainer>
			{ !player &&
				<form onSubmit={ createPlayer }>
					<label htmlFor="creator_name">
						<div>Name</div>
						<input autoComplete="username" id="creator_name" maxLength="15" minLength="3" required type="text" />
					</label>
					<button type="submit">Create</button>
				</form>
			}

			{ isCreator &&
				<div>You are the creator</div>
			}

			{ players.length > 0 &&
				<LobbyPlayerList players={ players } />
			}

			<button disabled={ players.length < 1 || players.length > 3 } onClick={ inviteOpponent }>Invite a friend</button>
			<button disabled={ !isCreator || players.length < 2 || players.length > 4 } onClick={ startGame }>Start the game</button>

		</LayoutWidthContainer>
	);
};

export default Lobby;
