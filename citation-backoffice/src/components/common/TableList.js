import styled from 'styled-components';

import { Link } from './Link';
import { gray } from '../style/colors';
import { ButtonContainer, ButtonLinkContainer } from '../common/Button';

export const TableList = styled.div`
	display: table;
	margin: 3rem auto;
	width: 80rem;
	font-size: 1.6rem;
	border-collapse: collapse;
`;

export const TableListRow = styled.div`
	display: table-row;
	border-bottom: .1rem solid ${gray};

	&:first-child {
		border-top: .1rem solid ${gray};
	}
`;

export const TableListLinkRow = TableListRow.withComponent(Link);

export const TableListCell = styled.div`
	display: table-cell;
	padding: 1.5rem;
	text-align: center;
	white-space: nowrap;

	&:first-child {
		width: 100%;
		text-align: left;
	}

	& ${ButtonContainer}, & ${ButtonLinkContainer} {
		margin: -.9rem 0;
	}
`;

export const TableListLinkCell = TableListCell.withComponent(Link);
