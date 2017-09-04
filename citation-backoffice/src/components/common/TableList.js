import styled from 'styled-components';

import Link from './Link';
import { gray } from '../style/colors';

export const TableList = styled.div`
	display: table;
	margin: 3rem auto;
	width: 50rem;
	font-size: 1rem;
	border-collapse: collapse;
`;

export const TableListRow = styled.div`
	display: table-row;
	border-bottom: 1px solid ${gray};

	&:first-child {
		border-top: 1px solid ${gray};
	}
`;

export const TableListLinkRow = styled(Link)`
	display: table-row;
	border-bottom: 1px solid ${gray};

	&:first-child {
		border-top: 1px solid ${gray};
	}
`;

export const TableListCell = styled.div`
	display: table-cell;
	padding: 1rem;
	text-align: center;
	white-space: nowrap;

	&:first-child {
		width: 100%;
		text-align: left;
	}
`;

export const TableListLinkCell = styled(Link)`
	display: table-cell;
	padding: 1rem;
	text-align: center;
	white-space: nowrap;

	&:first-child {
		width: 100%;
		text-align: left;
	}
`;
