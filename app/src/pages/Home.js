import React from 'react';
import { useHistory, Link } from "react-router-dom";
import styled, { css } from 'styled-components';

import { nanoid } from 'nanoid';
import swal from '@sweetalert/with-react';

import { OutlinedButton } from './../components/Button';
import { LayoutWidthContainer } from './../components/Layout';

const StyledHome = styled.main`
	text-align: center;;
`;

const Colored = styled.span`
	${ ({ color }) => {
			switch (color) {
				case '1':
					return css`
						color: var(--card-color-1);
					`
				case '2':
					return css`
						color: var(--card-color-2);
					`
				case '3':
					return css`
						color: var(--card-color-3);
					`
				case '4':
					return css`
						color: var(--card-color-4);
					`
				default:
					break;
			}
		}
	}
`;

const StyledHomeHeadline = styled.h1`
	font-size: 7rem;
	font-weight: bold;
	letter-spacing: -0.3ex;
	line-height: 1;
	margin: 2rem 0;
	/* -webkit-text-fill-color: transparent; */
	-webkit-text-stroke: 3px #111;
	transform: skewX(-20deg);
`;

const StyledHomeButtonContainer = styled.div`
`;

const StyledHomeButton = styled(OutlinedButton)`
	margin-top: 1rem;
	max-width: 35rem;
	width: 100%;
`;

const StyledDivider = styled.div`
	align-items: center;
	display: flex;
	justify-content: center;
	line-height: 1;
	margin: 2rem 0;

	&::before,
	&::after {
		background: currentColor;
		content: "";
		flex: 1 1 auto;
		height: 1px;
		margin: 0.3625em 1rem 0;
		width: 100%;
	}
`;

const Home = () => {
	const history = useHistory();

	const parseCode = (unparsedCode) => {
		if (unparsedCode.length === 5) {
			return unparsedCode;
		}

		const splitUnparsedCode = unparsedCode.replace(/\/$/, '').split('/');
		if (splitUnparsedCode[splitUnparsedCode.length - 1].length === 5) {
			return splitUnparsedCode[splitUnparsedCode.length - 1];
		}

		return null;
	};

	const promptForGameCode = () => {
		swal({
			text: 'Enter the code of the game that you would like to join',
			content: "input",
			button: {
				text: "Join game!",
				closeModal: true,
			},
		})
		.then((value) => {
			console.log({value});
			if (value === null) {
				return;
			}

			const code = parseCode(value);
			console.log({ value, code });

			if (code !== null) {
				history.push(`/lobby/${ code }`);
			} else {
				swal(`That doesn't seem to be a valid game code: ${value}`)
					.then(() => {
						promptForGameCode();
					});
			}
		});
	};

	return (
		<StyledHome>
			<LayoutWidthContainer>
				<StyledHomeHeadline>
					<Colored color="1">U</Colored>
					<Colored color="2">N</Colored>
					<Colored color="3">O</Colored>
					<Colored color="4">!</Colored>
				</StyledHomeHeadline>

				<StyledHomeButtonContainer>
					Would you like to create a
					<div>
						<StyledHomeButton
							as={Link}
							to={`/lobby/${nanoid(5)}?role=host`}
						>new game</StyledHomeButton>
					</div>
				</StyledHomeButtonContainer>

				<StyledDivider>or</StyledDivider>

				<StyledHomeButtonContainer>
					do you have a code to
					<div>
						<StyledHomeButton
							onClick={ promptForGameCode }
						>join a Game</StyledHomeButton>
					</div>
				</StyledHomeButtonContainer>
			</LayoutWidthContainer>
		</StyledHome>
	);
};

export default Home;
