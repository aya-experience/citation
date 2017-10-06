import { get, values } from 'lodash';
import React from 'react';
import { string, array } from 'prop-types';
import { connect } from 'react-redux';

import { Link } from '../common/Link';
import { Breadcrumb } from '../common/Breadcrumb';
import { TableList, TableListRow, TableListCell, TableListLinkCell } from '../common/TableList';
import { ButtonLink } from '../common/Button';

const enhancer = connect((state, ownProps) => ({
	type: ownProps.match.params.id,
	entries: values(get(state.content, ownProps.match.params.id, {}))
}));

const EntryList = ({ type, entries }) => (
	<div>
		<Breadcrumb>
			<Link to="/content">CONTENT</Link> / {type} / Choose an entry...
		</Breadcrumb>
		<TableList>
			{entries.map(({ _id_ }) => (
				<TableListRow key={_id_}>
					<TableListLinkCell to={`/content/entry/${type}/${_id_}`}>{_id_}</TableListLinkCell>
					<TableListCell>
						<ButtonLink icon="plus" to={`/content/entry/${type}`} />
					</TableListCell>
				</TableListRow>
			))}
		</TableList>
	</div>
);

EntryList.propTypes = {
	type: string,
	entries: array
};

export default enhancer(EntryList);
