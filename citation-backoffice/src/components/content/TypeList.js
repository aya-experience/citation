import { map, keys } from 'lodash';
import React from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';

import { Breadcrumb } from '../common/Breadcrumb';
import { TableList, TableListLinkRow, TableListCell } from '../common/TableList';

const enhancer = connect(state => ({ types: state.content }));

const TypeList = ({ types }) => (
	<div>
		<Breadcrumb>CONTENT / Choose a type...</Breadcrumb>
		<TableList>
			{map(types, (entries, typeName) => (
				<TableListLinkRow key={typeName} to={`/content/type/${typeName}`}>
					<TableListCell>{typeName}</TableListCell>
					<TableListCell>{keys(entries).length} items</TableListCell>
				</TableListLinkRow>
			))}
		</TableList>
	</div>
);

TypeList.propTypes = {
	types: object.isRequired
};

export default enhancer(TypeList);
