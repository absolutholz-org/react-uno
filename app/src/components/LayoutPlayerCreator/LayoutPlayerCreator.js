import React from 'react';

const LayoutPlayerCreator = ({ handleCreation }) => {
	return (
		<form onSubmit={ handleCreation }>
			<label htmlFor="creator_name">
				<div>Name</div>
				<input autoComplete="username" id="creator_name" maxLength="15" minLength="3" required type="text" />
			</label>
			<button type="submit">Create</button>
		</form>
	);
};

export default LayoutPlayerCreator;
