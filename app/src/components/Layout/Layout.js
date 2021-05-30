import React from 'react';
import { Link } from "react-router-dom";

import { ReactComponent as SvgHome } from '@mdi/svg/svg/home.svg';

import './Layout.scss';

export const LayoutWidthContainer = ({ children }) => {
	return (
		<>
			<header className="l-width-container">
				<Link to="/">
					<SvgHome />
				</Link>
			</header>
			<main className="l-width-container">{ children }</main>
		</>
	);
};
