import { get } from 'lodash';
import React from 'react';
import { string, object, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';

import { Link } from '../common/Link';
import { Breadcrumb } from '../common/Breadcrumb';
import { loadEntry, writeEntry, deleteEntry } from '../../logic/content';
import { loadTypeFields } from '../../logic/model';
import EntryForm from './EntryForm';
import form2data from '../../utils/form2data';

const enhancer = compose(
	connect(
		(state, ownProps) => {
			const { type, id } = ownProps.match.params;
			let entry = get(state.content, `${type}.${id}`, {});
			entry = entry === null ? {} : entry;
			return {
				type,
				id,
				entry,
				fields: get(state.model, `${type}.fields`, {}),
				types: state.content
			};
		},
		(dispatch, ownProps) => {
			const { type, id } = ownProps.match.params;
			return {
				loadFields: type => dispatch(loadTypeFields(type)),
				load: fields => dispatch(loadEntry(type, id, fields)),
				write: (data, fields) => dispatch(writeEntry(type, id, data, fields)),
				del: () => deleteEntry(type, id) // Delete is a reserved keyword
			};
		}
	),
	lifecycle({
		componentDidMount() {
			this.props.loadFields(this.props.type).then(() => this.props.load(this.props.fields));
		}
	}),
	withHandlers({
		handleSubmit: ({ fields, write }) => values => write(form2data(values, fields), fields),
		handleDelete: ({ del }) => () => del()
	})
);

const Entry = ({ id, type, entry, fields, types, handleSubmit, handleDelete }) => (
	<div>
		<Breadcrumb>
			<Link to="/content">CONTENT</Link> / <Link to={`/content/type/${type}`}>{type}</Link> /{' '}
			{id ? id : 'New entry...'}
		</Breadcrumb>
		<EntryForm
			type={type}
			initialValues={entry}
			fields={fields}
			types={types}
			onSubmit={handleSubmit}
			onDelete={handleDelete}
		/>
	</div>
);

Entry.propTypes = {
	id: string.isRequired,
	type: string.isRequired,
	entry: object.isRequired,
	fields: object.isRequired,
	types: object.isRequired,
	handleSubmit: func.isRequired,
	handleDelete: func.isRequired
};

export default enhancer(Entry);
