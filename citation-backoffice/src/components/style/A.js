import styled from 'styled-components';

import { darkBlue } from './colors';

const A = styled.a`
	cursor: pointer;
	color: ${darkBlue};
	text-decoration: none;

	&:hover {
		color: black;
	}
`;

export default A;
