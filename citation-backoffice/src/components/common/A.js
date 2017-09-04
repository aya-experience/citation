import styled from 'styled-components';

import { darkBlue, green } from '../style/colors';

const A = styled.a`
	cursor: pointer;
	color: ${darkBlue};
	text-decoration: none;
	transition: color .5s ease;

	&:hover {
		color: ${green};
	}
`;

export default A;
