import { get } from 'lodash';
import React from 'react';
import { string, object, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';

import { Link } from '../common/Link';
import { Breadcrumb } from '../common/Breadcrumb';
import { loadObject, writeObject, deleteObject } from '../../logic/objects';
import { loadSchemaFields } from '../../logic/schema';
import ObjectForm from '../forms/ObjectForm';
import { filterObjectFields } from '../../utils/filters';
import form2data from '../../utils/form2data';

const enhancer = compose(
	connect(
		(state, ownProps) => {
			const { type, id } = ownProps.match.params;
			let object = get(state.objects, `${type}.${id}`, {});
			object = object === null ? {} : object;
			return {
				type,
				id,
				object,
				fields: filterObjectFields(state.fields),
				collections: state.collections
			};
		},
		(dispatch, ownProps) => {
			const { type, id } = ownProps.match.params;
			return {
				loadFields: type => dispatch(loadSchemaFields([type])),
				load: fields => dispatch(loadObject(type, id, fields)),
				write: (data, fields) => dispatch(writeObject(type, id, data, fields)),
				del: () => deleteObject(type, id) // Delete is a reserved keyword
			};
		}
	),
	lifecycle({
		componentDidMount() {
			this.props.loadFields([this.props.type]).then(() => this.props.load(this.props.fields));
		},
		componentWillReceiveProps(nextProps) {
			if (this.props.fields[nextProps.type]) {
				nextProps.load(this.props.fields);
			} else {
				nextProps.loadFields([nextProps.type]).then(() => nextProps.load(this.props.fields));
			}
		}
	}),
	withHandlers({
		handleSubmit: ({ type, fields, write }) => values => write(form2data(values, fields[type]), fields[type]),
		handleDelete: ({ del }) => () => del()
	})
);

const ObjectComponent = ({ id, type, object, fields, collections, handleSubmit, handleDelete }) =>
	<div>
		<Breadcrumb>
			<Link to="/content">CONTENT</Link> / <Link to={`/content/type/${type}`}>{type}</Link> /{' '}
			{id ? id : 'New object...'}
		</Breadcrumb>
		<ObjectForm
			type={type}
			initialValues={object}
			fields={fields}
			collections={collections}
			onSubmit={handleSubmit}
			onDelete={handleDelete}
		/>
	</div>;

ObjectComponent.propTypes = {
	id: string.isRequired,
	type: string.isRequired,
	object: object.isRequired,
	fields: object.isRequired,
	collections: object.isRequired,
	handleSubmit: func.isRequired,
	handleDelete: func.isRequired
};

export default enhancer(ObjectComponent);
