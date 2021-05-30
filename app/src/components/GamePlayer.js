// react dependencies
import React, { useState, useEffect } from 'react';

// external dependencies
import { usePubNub } from 'pubnub-react';

// internal scripts
import { ACTION_DEAL } from './../pages/Game';

// internal components

const GameGuest = ({ name, id, gameChannel }) => {
	const playerChannel = `${ gameChannel }-${ id }`;
	const pubNub = usePubNub();

	const [ cards, setCards ] = useState([]);

	useEffect(() => {
		pubNub.addListener({
			message: (message) => {
				console.log('message listener', { message }, message.message.action, ACTION_DEAL);
				if (message.message.action === ACTION_DEAL) {
					console.log('message listener', message.message.cards, message.message.action);
					setCards(message.message.cards);
				}
			},
		});

		pubNub.subscribe({ channels: [ gameChannel, playerChannel ] });
	}, [ pubNub, gameChannel, playerChannel ]);

	return (
		<section id={ id }>
			<h3>{ name }</h3>
			<section>
				<h4>Cards</h4>
				<ul>
					{
						cards.map((card) => (
							<li key={ card.id }>
								<button>
									{ card.color } - { card.name }
								</button>
							</li>
						))
					}
				</ul>
			</section>
		</section>
	);
};

export default GameGuest;
