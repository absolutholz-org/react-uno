// react dependencies
import React from 'react';

// internal components
import PlayerPreview from './../PlayerPreview';

// styles
import './PlayerPreviewList.scss';

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
