// react dependencies
import React from 'react';

// external dependencies

// internal scripts

// internal components
import PlayerPreview from './../PlayerPreview';

const PlayerPreviewList = ({ players }) => {
	return (
		<ol className="player-preview-list">
			{
				players.map((player) => (
					<li key={ player.uuid }>
						<PlayerPreview
							cardCount={ player.cards.length }
							name={ player.name }
						/>
					</li>
				))
			}
		</ol>
	);
};

export default PlayerPreviewList;
