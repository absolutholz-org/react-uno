import styled, { css } from 'styled-components/macro';

// https://styled-components.com/docs/api#as-polymorphic-prop

export const TextButton = styled.button`
	background: transparent;
	border: 2px solid transparent;
	border-radius: 4px;
	color: var(--highlight);
	display: inline-block;
	font: inherit;
	font-size: 1.25rem;
	font-weight: 500;
	padding: 0.3125em 2rem;
	text-align: center;
	text-decoration: none;
	text-transform: uppercase;

	${ ({ block }) =>
		block
			? css`
				display: block;
				width: 100%;
			`
			: css``
	}
`;

export const OutlinedButton = styled(TextButton)`
	border-color: var(--highlight);
`;

export const ContainedButton = styled(TextButton)`
	background: var(--highlight);
	color: var(--on-highlight);
`;

export default TextButton;
