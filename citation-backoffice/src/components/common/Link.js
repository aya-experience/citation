import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

import { darkBlue, green } from '../style/colors';

export const A = styled.a`
	cursor: pointer;
	color: ${darkBlue};
	text-decoration: none;
	transition: color 0.5s ease;

	&:hover {
		color: ${green};
	}
`;

export const Link = A.withComponent(RouterLink);
