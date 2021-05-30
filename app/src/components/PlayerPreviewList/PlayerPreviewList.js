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
							cardCount={ player.cardCount }
							name={ player.name }
							isCurrent={ player.isCurrent }
							isNext={ player.isNext }
						/>
					</li>
				))
			}
		</ol>
	);
};

export default PlayerPreviewList;
