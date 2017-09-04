import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

import { darkBlue, green } from '../style/colors';

const Link = styled(RouterLink)`
	cursor: pointer;
	color: ${darkBlue};
	text-decoration: none;
	transition: color .5s ease;

	&:hover {
		color: ${green};
	}
`;

export default Link;
