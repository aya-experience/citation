import { keys, values, get } from 'lodash';
import React from 'react';
import { object, func, array } from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';

import SchemaForm from './SchemaForm';
import { Breadcrumb } from '../common/Breadcrumb';
import { Link } from '../common/Link';
import { loadTypeFields } from '../../logic/model';
import { testFieldName } from '../../utils/filters';

const enhancer = compose(
	connect(
		(state, ownProps) => {
			return {
				types: keys(state.model),
				type: get(state.model, ownProps.match.params.id, null)
			};
		},
		(dispatch, ownProps) => ({
			load: () => dispatch(loadTypeFields(ownProps.match.params.id))
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.load();
		}
	}),
	withHandlers({
		handleSubmit: ({ onSubmit }) => values =>
			onSubmit({
				name: values.__name__,
				fields: keys(values.__fields__).map(key => {
					const field = values.__fields__[key];
					if (field.kind === 'OBJECT') {
						return { name: field.name, type: ['link', field.typeName] };
					} else if (field.kind === 'LIST') {
						return { name: field.name, type: ['links', field.typeName] };
					}
					return { name: field.name, type: field.kind.toLowerCase() };
				})
			})
	})
);

const Type = ({ type, types, handleSubmit }) => {
	if (type === null) {
		return null;
	}

	const initialValues = {
		__name__: type.name,
		__fields__: values(type.fields)
			.filter(testFieldName)
			.map(field => ({
				name: field.name,
				kind: field.kind === 'SCALAR' ? field.typeName : field.kind
			}))
	};

	return (
		<div>
			<Breadcrumb>
				<Link to="/model">MODEL</Link> / {type.name}
			</Breadcrumb>
			<SchemaForm
				fields={type.fields}
				initialValues={initialValues}
				schema={type.name}
				onSubmit={handleSubmit}
				types={types}
			/>
		</div>
	);
};

Type.propTypes = {
	type: object,
	types: array.isRequired,
	handleSubmit: func.isRequired
};

export default enhancer(Type);
