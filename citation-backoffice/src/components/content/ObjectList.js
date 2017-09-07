import { get } from 'lodash';
import React from 'react';
import { string, array } from 'prop-types';
import { connect } from 'react-redux';

import { Link } from '../common/Link';
import { Breadcrumb } from '../common/Breadcrumb';
import { TableList, TableListRow, TableListCell, TableListLinkCell } from '../common/TableList';
import { ButtonLink } from '../common/Button';

const enhancer = connect((state, ownProps) => ({
	type: ownProps.match.params.id,
	objects: get(state.collections, ownProps.match.params.id, [])
}));

const ObjectList = ({ type, objects }) =>
	<div>
		<Breadcrumb>
			<Link to="/content">CONTENT</Link> / {type} / Choose an object...
		</Breadcrumb>
		<TableList>
			{objects.map(({ __id__ }) =>
				<TableListRow key={__id__}>
					<TableListLinkCell to={`/content/object/${type}/${__id__}`}>
						{__id__}
					</TableListLinkCell>
					<TableListCell>
						<ButtonLink icon="plus" to={`/content/object/${type}`} />
					</TableListCell>
				</TableListRow>
			)}
		</TableList>
	</div>;

ObjectList.propTypes = {
	type: string,
	objects: array
};

export default enhancer(ObjectList);
