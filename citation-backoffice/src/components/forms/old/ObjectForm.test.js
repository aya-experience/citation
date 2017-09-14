import React, { Component } from 'react';
import { string, object, func } from 'prop-types';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { store } from './../../reduxMock';

const testProps = sinon.stub().returns(null);

class testComponent extends Component {
	static propTypes = {
		name: string.isRequired,
		component: string.isRequired,
		type: string,
		props: object,
		format: func,
		parse: func
	};

	render() {
		testProps(
			this.props.name,
			this.props.component,
			this.props.type,
			this.props.props,
			this.props.format,
			this.props.parse
		);
		return null;
	}
}

const handleSubmit = sinon.stub().returns(Promise.resolve([]));
const handleDelete = sinon.stub().returns(Promise.resolve([]));

const collections = {};
const fields = {
	type: {
		field1: { typeName: 'RichText' },
		field2: { typeName: 'text' },
		field3: { typeName: '*', kind: 'OBJECT' },
		field4: { typeName: 'test', kind: 'OBJECT' },
		field5: { typeName: '*', kind: 'LIST' },
		field6: { typeName: 'test', kind: 'LIST' },
		field7: { ofType: 'KeyValuePair', kind: 'LIST' },
		field8: { typeName: 'JSON' }
	}
};
const type = 'type';

const properties = {
	handleSubmit,
	handleDelete,
	collections,
	fields,
	type
};

let ObjectForm;
let objectForm;

const setup = () =>
	shallow(<ObjectForm {...properties} />, { context: { store } })
		.dive()
		.dive()
		.dive();

test.beforeEach(() => {
	ObjectForm = proxyquire('./ObjectForm', {
		'redux-form': {
			Field: testComponent,
			FieldArray: testComponent
		},
		'./LinkField': {
			default: 'LinkField'
		},
		'./LinksField': {
			default: 'LinksField'
		},
		'./KeyValueField': {
			default: 'KeyValueField'
		}
	}).default;
	objectForm = setup();
});

test.afterEach(() => {
	testProps.reset();
});

test('If fields[type] is empty, there will be only an __id__', t => {
	testProps.reset();
	const emptyFieldsProperties = {
		handleSubmit,
		handleDelete,
		collections,
		fields: {},
		type
	};
	const noFieldsObjectForm = shallow(<ObjectForm {...emptyFieldsProperties} />);
	noFieldsObjectForm.html();
	t.is(testProps.args.length, 1);
});

test('On ObjectForm submit, func prop handleSubmit should be called', t => {
	objectForm.simulate('submit');
	t.true(handleSubmit.called);
});

test('On ObjectForm delete, func prop handleDelete should be called', t => {
	objectForm.find('[type="button"]').simulate('click');
	t.true(handleDelete.called);
});

test('field1 should be textarea', t => {
	t.true(testProps.calledWith('field1', 'textarea'));
});

test('field2 should betext', t => {
	t.true(testProps.calledWith('field2', 'input', 'text'));
});

test('field3 should be LinkField with no type', t => {
	t.true(testProps.calledWith('field3', 'LinkField', undefined, { collections }));
});

test('field4 should be LinkField with test type', t => {
	t.true(
		testProps.calledWith('field4', 'LinkField', undefined, {
			collections,
			type: 'test'
		})
	);
});

test('field5 should be LinksField with no type', t => {
	t.true(testProps.calledWith('field5', 'LinksField', undefined, { collections }));
});

test('field6 should be Linksfield with test type', t => {
	t.true(
		testProps.calledWith('field6', 'LinksField', undefined, {
			collections,
			type: 'test'
		})
	);
});

test('field7 sould be KeyValueField', t => {
	t.true(testProps.calledWith('field7', 'KeyValueField', undefined, { collections }));
});

test('field8 should be textarea', t => {
	t.true(testProps.calledWith('field8', 'textarea'));
});

test('field8 format function should stringify value', t => {
	const format = value => JSON.stringify(value, null, 2);
	const value = 'My Value';
	t.is(testProps.args[8][4](value), format(value));
});

test('field8 parse function should parse value', t => {
	const parse = value => JSON.parse(value);
	const value = '"My Value"';
	t.is(testProps.args[8][5](value), parse(value));
});
