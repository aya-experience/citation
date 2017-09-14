import { map, keys } from 'lodash';
import React from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';

import { Breadcrumb } from '../common/Breadcrumb';
import { TableList, TableListLinkRow, TableListCell } from '../common/TableList';
import { filterSchemaEditable } from '../../utils/filters';

const enhancer = connect(state => ({ fields: state.fields }));

const TypeList = ({ fields }) => (
	<div>
		<Breadcrumb>MODEL / Choose a type...</Breadcrumb>
		<TableList>
			{map(filterSchemaEditable(fields), (value, key) => (
				<TableListLinkRow key={key} to={`/model/schema/${key}`}>
					<TableListCell>{key}</TableListCell>
					<TableListCell>{keys(value).length} fields</TableListCell>
				</TableListLinkRow>
			))}
		</TableList>
	</div>
);

TypeList.propTypes = {
	fields: object
};

export default enhancer(TypeList);
