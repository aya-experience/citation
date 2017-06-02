
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import {winston} from './../winstonMock';

let filters;
let isEmpty;

test.beforeEach(() => {
	isEmpty = sinon.stub().returns(Promise.resolve([]));
	filters = proxyquire('./filters', {
		lodash: {isEmpty},
		winston
	});
});

test('filterFields value should filter reserved types names', t => {
	const inputValues = {test: {}, secondTest: {}};
	const reservedNames = ['secondTest'];
	const outputValues = {test: {}};
	t.deepEqual(filters.filterFields(inputValues, reservedNames), outputValues);
});

test('filterFields value should filter field name matching the regex', t => {
	const inputValues = {test: {firstField: 'firstField', __secondField__: 'secondField'}};
	const reservedNames = [];
	const outputValues = {test: {firstField: 'firstField'}};
	t.deepEqual(filters.filterFields(inputValues, reservedNames), outputValues);
});

test('regexNames shoud return true if the given name match the regex', t => {
	const name = '__name__';
	t.true(filters.regexNames(name));
});

test('regexNames shoud return false if the given name does not match the regex', t => {
	const name = 'name';
	t.false(filters.regexNames(name));
});

test('filterSchemaNames should return true if the given name is not reserved and does not match the regex', t => {
	const name = 'Test';
	t.true(filters.filterSchemaNames(name));
});

test('filterSchemaNames should return false if the given name match the regex', t => {
	const name = '__Test__';
	t.false(filters.filterSchemaNames(name));
});

test('filterSchemaNames should return false if the given name is reserved', t => {
	const name = 'Mutation';
	t.false(filters.filterSchemaNames(name));
});

test('filterSchemaFields should return undefined if the given values are undefined', t => {
	isEmpty.returns(false);
	const values = undefined;
	t.is(filters.filterSchemaFields(values), undefined);
});

test('filterSchemaFields should return an empty object if the given values are empty', t => {
	isEmpty.returns(true);
	const values = {};
	t.deepEqual(filters.filterSchemaFields(values), {});
});

test('filterSchemaFields should return filtered values', t => {
	isEmpty.returns(false);
	const inputValues = {Page: {}, Test: {firstField: 'firstField', __secondField__: 'secondField'}};
	const outputValues = {Test: {firstField: 'firstField'}};
	t.deepEqual(filters.filterSchemaFields(inputValues), outputValues);
});

test('filterObjectFields should return undefined if the given values are undefined', t => {
	isEmpty.returns(false);
	const values = undefined;
	t.is(filters.filterObjectFields(values), undefined);
});

test('filterObjectFields should return an empty object if the given values are empty', t => {
	isEmpty.returns(true);
	const values = {};
	t.deepEqual(filters.filterObjectFields(values), {});
});

test('filterObjectFields should return filtered values', t => {
	isEmpty.returns(false);
	const inputValues = {Test: {firstField: 'firstField', __secondField__: 'secondField'}};
	const outputValues = {Test: {firstField: 'firstField'}};
	t.deepEqual(filters.filterObjectFields(inputValues), outputValues);
});
