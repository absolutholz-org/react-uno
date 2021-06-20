// react dependencies
import React, { useRef, useState, useEffect } from 'react';

// external dependencies
import { nanoid } from 'nanoid';

// internal components
import { Dialog, DialogHeader, DialogFooter } from './../Dialog';
import { ContainedButton } from './../Button';

function createUuid (name, id) {
	return `${ name }||${ id }`;
}

const CreatePlayerForm = ({ setPlayer }) => {
	const ref = useRef(null);

	const [ isFormInvalid, setIsFormInvalid ] = useState(true);

	// Need to listen for event this wey because sweetalert seems to swallow the event otherwise
	// https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element
	useEffect(() => {
		console.log(ref.current);
		if (ref.current) {
			ref.current.addEventListener('input', (event) => {
				setIsFormInvalid(!ref.current.checkValidity());
			});

			ref.current.addEventListener('submit', (event) => {
				const name = event.target.querySelector('#player_name').value;
				const id = event.target.querySelector('#player_id').value;
				const uuid = createUuid(name, id);
				const player = {
					name,
					uuid,
				};
				console.log('create player', player);
				setPlayer(player);
				window.localStorage.setItem(`pubnub-player-id`, uuid);
				event.preventDefault();
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ ref.current ]);

	// const createPlayer = (event) => {
	// 	console.log({ event });
	// 	event.preventDefault();
	// 	const name = event.target.querySelector('#player_name').value;
	// 	const id = event.target.querySelector('#player_id').value;
	// 	const uuid = createUuid(name, id);
	// 	const player = {
	// 		name,
	// 		uuid,
	// 	};
	// 	console.log('create player', player);
	// 	setPlayer(player);
	// 	window.localStorage.setItem(`pubnub-player-id`, uuid);
	// };

	return (
		<Dialog
			as="form"
			// onSubmit={ createPlayer }
			ref={ ref }
		>
			<DialogHeader
				as="h2"
			>Welcome!</DialogHeader>

			<input
				id="player_id"
				type="hidden"
				value={ nanoid(10) }
			/>

			<label
				htmlFor="player_name"
				>
				<div>What would you like to be called?</div>
				<input
					autoComplete="username"
					id="player_name"
					maxLength="15"
					minLength="3"
					name="name"
					required
					type="text"
				/>
			</label>

			<DialogFooter>
				<ContainedButton
					disabled={ isFormInvalid }
					type="submit"
					>Join the game</ContainedButton>
			</DialogFooter>
		</Dialog>
	);
};

export default CreatePlayerForm;
