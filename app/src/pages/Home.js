import React from 'react';
import { Link } from "react-router-dom";

import { nanoid } from 'nanoid';

import { LayoutWidthContainer } from './../components/Layout';

const Home = () => {
	return (
		<LayoutWidthContainer>
			<h1>Home</h1>
			<Link to={ `/lobby/${ nanoid(5) }` }>Create</Link>
			<button>Join</button>
		</LayoutWidthContainer>
	);
};

export default Home;
