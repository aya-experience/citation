import { map } from 'lodash';
import React from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';

import { Breadcrumb } from '../common/Breadcrumb';
import { TableList, TableListLinkRow, TableListCell } from '../common/TableList';

const enhancer = connect(state => ({ collections: state.collections }));

const TypeList = ({ collections }) =>
	<div>
		<Breadcrumb>CONTENT / Choose a type...</Breadcrumb>
		<TableList>
			{map(collections, (value, key) =>
				<TableListLinkRow key={key} to={`/content/type/${key}`}>
					<TableListCell>
						{key}
					</TableListCell>
					<TableListCell>
						{value.length} items
					</TableListCell>
				</TableListLinkRow>
			)}
		</TableList>
	</div>;

TypeList.propTypes = {
	collections: object
};

export default enhancer(TypeList);
