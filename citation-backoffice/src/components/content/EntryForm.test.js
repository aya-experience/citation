import { isFunction } from 'lodash';
import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { Form } from '../common/Form';
import { store } from '../../utils/mocks/store.mock';

const handleSubmit = sinon.stub().returns(Promise.resolve([]));
const onDelete = sinon.stub().returns(Promise.resolve([]));

const types = {};
const fields = {
	field1: { name: 'field1', typeName: 'RichText' },
	field2: { name: 'field2', typeName: 'text' },
	field3: { name: 'field3', typeName: '*', kind: 'OBJECT' },
	field4: { name: 'field4', typeName: 'test', kind: 'OBJECT' },
	field5: { name: 'field5', typeName: '*', kind: 'LIST' },
	field6: { name: 'field6', typeName: 'test', kind: 'LIST' },
	field7: { name: 'field7', ofType: 'KeyValuePair', kind: 'LIST' },
	field8: { name: 'field8', typeName: 'JSON' }
};
const type = 'type';

const props = {
	handleSubmit,
	onDelete,
	types,
	fields,
	type
};

let EntryForm;

const setup = () =>
	shallow(<EntryForm {...props} />, { context: { store } })
		.dive()
		.dive()
		.dive();

test.beforeEach(() => {
	handleSubmit.reset();
	onDelete.reset();
	EntryForm = proxyquire('./EntryForm', {
		'redux-form': {
			Field: () => {},
			FieldArray: () => {}
		},
		'../forms/LinkField': {
			default: 'LinkField'
		},
		'../forms/LinksField': {
			default: 'LinksField'
		},
		'../forms/KeyValueField': {
			default: 'KeyValueField'
		}
	}).default;
});

test('should render only an _id_ if there is no fields', t => {
	const props = {
		handleSubmit,
		onDelete,
		types,
		fields: {},
		type
	};
	const entryForm = shallow(<EntryForm {...props} />, { context: { store } })
		.dive()
		.dive()
		.dive();
	t.is(entryForm.find(Form).children().length, 2);
});

test('should call handleSubmit on form submit', t => {
	const entryForm = setup();
	entryForm.simulate('submit');
	t.true(handleSubmit.called);
});

test('should call onDelete on click on delete button', t => {
	const entryForm = setup();
	entryForm.find('[icon="delete"]').simulate('click');
	t.true(onDelete.called);
});

test('field1 should be textarea', t => {
	const entryForm = setup();
	t.deepEqual(entryForm.find('[name="field1"]').props(), {
		name: 'field1',
		component: 'textarea'
	});
});

test('field2 should betext', t => {
	const entryForm = setup();
	t.deepEqual(entryForm.find('[name="field2"]').props(), {
		name: 'field2',
		component: 'input',
		type: 'text'
	});
});

test('field3 should be LinkField with no type', t => {
	const entryForm = setup();
	t.deepEqual(entryForm.find('[name="field3"]').props(), {
		name: 'field3',
		component: 'LinkField',
		props: { types }
	});
});

test('field4 should be LinkField with test type', t => {
	const entryForm = setup();
	t.deepEqual(entryForm.find('[name="field4"]').props(), {
		name: 'field4',
		component: 'LinkField',
		props: { types, type: fields.field4.typeName }
	});
});

test('field5 should be LinksField with no type', t => {
	const entryForm = setup();
	t.deepEqual(entryForm.find('[name="field5"]').props(), {
		name: 'field5',
		component: 'LinksField',
		props: { types }
	});
});

test('field6 should be Linksfield with test type', t => {
	const entryForm = setup();
	t.deepEqual(entryForm.find('[name="field6"]').props(), {
		name: 'field6',
		component: 'LinksField',
		props: { types, type: fields.field6.typeName }
	});
});

test('field7 sould be KeyValueField', t => {
	const entryForm = setup();
	t.deepEqual(entryForm.find('[name="field7"]').props(), {
		name: 'field7',
		component: 'KeyValueField',
		props: { types }
	});
});

test('field8 should be textarea', t => {
	const entryForm = setup();
	const props = entryForm.find('[name="field8"]').props();
	t.is(props.name, 'field8');
	t.is(props.component, 'textarea');
	t.true(isFunction(props.format));
	t.true(isFunction(props.parse));
});

test('field8 format function should stringify value', t => {
	const entryForm = setup();
	const props = entryForm.find('[name="field8"]').props();
	t.is(
		props.format({ test: 'test' }),
		`{
  "test": "test"
}`
	);
});

test('field8 parse function should parse value', t => {
	const entryForm = setup();
	const props = entryForm.find('[name="field8"]').props();
	t.deepEqual(
		props.parse(`{
  "test": "test"
}`),
		{ test: 'test' }
	);
});
