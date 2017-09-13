import { clone, cloneDeep, keys, get } from 'lodash';
import React from 'react';
import { string, object, func, array } from 'prop-types';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import SchemaForm from './SchemaForm';
import { filterSchemaFields } from '../../utils/filters';
import { Breadcrumb } from '../common/Breadcrumb';
import { Link } from '../common/Link';

const enhancer = compose(
	connect((state, ownProps) => {
		return {
			collections: state.schema.data,
			schema: ownProps.match.params.id,
			fields: get(filterSchemaFields(state.fields), ownProps.match.params.id, null)
		};
	}),
	withHandlers({
		handleSubmit: ({ onSubmit }) => values => {
			const result = clone(values);
			const schema = { schema: {} };
			schema.schema.types = keys(result.data).map(type => {
				const field = { name: result.data[type].__name__ };
				delete result.data[type].__name__;
				field.fields = keys(result.data[type].__fields__).map(key => {
					const field = result.data[type].__fields__[key];
					if (field.kind === 'OBJECT') {
						return { name: field.name, type: ['link', field.typeName] };
					} else if (field.kind === 'LIST') {
						return { name: field.name, type: ['links', field.typeName] };
					}
					return { name: field.name, type: field.kind.toLowerCase() };
				});
				return field;
			});
			onSubmit(schema);
		}
	})
);

const Schema = ({ fields, schema, collections, handleSubmit }) => {
	if (fields === null) {
		return null;
	}

	const actualValues = cloneDeep(fields);
	const initialValues = {
		__name__: schema,
		__fields__: keys(actualValues).map(field => {
			actualValues[field].name = field;
			actualValues[field].kind =
				actualValues[field].kind === 'SCALAR' ? actualValues[field].typeName : actualValues[field].kind;
			return actualValues[field];
		})
	};

	return (
		<div>
			<Breadcrumb>
				<Link to="/model">MODEL</Link> / <Link to={`/model/schema/${schema}`}>{schema}</Link>
			</Breadcrumb>
			<SchemaForm
				fields={fields}
				initialValues={initialValues}
				schema={schema}
				onSubmit={handleSubmit}
				collections={collections}
			/>
		</div>
	);
};

Schema.propTypes = {
	schema: string.isRequired,
	fields: object,
	collections: array,
	handleSubmit: func.isRequired
};

export default enhancer(Schema);
