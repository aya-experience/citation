import React, { Component } from 'react';
import { string } from 'prop-types';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

let FieldType;

const testProps = sinon.stub().returns(null);

class testComponent extends Component {
	static propTypes = {
		name: string.isRequired,
		component: string.isRequired
	};

	render() {
		testProps(this.props.name, this.props.component);
		return null;
	}
}

const input = {};
const setup = () =>
	shallow(
		<FieldType
			input={input}
			kindName="Kind"
			typeName="Type"
			types={['collection1', 'collection2']}
		/>
	);

test.beforeEach(() => {
	FieldType = proxyquire('./FieldType', {
		'redux-form': {
			Field: testComponent
		}
	}).default;
});

test('testProps should be called only once if the type is scalar', t => {
	testProps.reset();
	input.value = 'RichText';
	const fieldType = setup();
	fieldType.html();
	t.true(testProps.calledOnce);
});

test('testProps should be called twice if the type is not scalar', t => {
	testProps.reset();
	input.value = 'OBJECT';
	const fieldType = setup();
	fieldType.html();
	t.true(testProps.calledTwice);
});
