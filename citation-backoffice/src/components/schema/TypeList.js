import { map, values } from 'lodash';
import React from 'react';
import { array } from 'prop-types';
import { connect } from 'react-redux';

import { Breadcrumb } from '../common/Breadcrumb';
import { TableList, TableListLinkRow, TableListCell } from '../common/TableList';
import { testEditableName, testFieldName } from '../../utils/filters';

const enhancer = connect(state => ({ types: values(state.model) }));

const TypeList = ({ types }) => (
	<div>
		<Breadcrumb>MODEL / Choose a type...</Breadcrumb>
		<TableList>
			{map(types.filter(testEditableName), type => (
				<TableListLinkRow key={type.name} to={`/model/type/${type.name}`}>
					<TableListCell>{type.name}</TableListCell>
					<TableListCell>{values(type.fields).filter(testFieldName).length} fields</TableListCell>
				</TableListLinkRow>
			))}
		</TableList>
	</div>
);

TypeList.propTypes = {
	types: array
};

export default enhancer(TypeList);
