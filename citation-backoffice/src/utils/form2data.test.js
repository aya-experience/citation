import test from 'ava';
import form2data from './form2data';

const fields = {
	test: { typeName: '*', kind: 'LIST' },
	secondTest: { typeName: 'String', kind: 'SCALAR' },
	thirdTest: { typeName: 'test', kind: 'OBJECT' },
	fourthTest: { typeName: 'TEST', kind: 'LIST' },
	fifthTest: { typeName: '*', kind: 'OBJECT' },
	sixthTest: { typeName: '*', kind: 'LIST', ofType: 'KeyValuePair' },
	seventhTest: { typename: 'String', kind: 'SCALAR' }
};
const values = {
	test: [{ _id_: 'myTest', _type_: 'testType' }],
	secondTest: 'mySecondTest',
	thirdTest: { _id_: 'myThirdTest' },
	fourthTest: [{ _id_: 'myFourthTest' }],
	fifthTest: { _id_: 'myFifthTest', _type_: 'testType' },
	sixthTest: [{ _key_: 'mySixthTest', _value_: { _id_: 'id', _type_: 'type' } }],
	seventhTest: null
};
const expected = {
	test: {
		links: [{ type: 'testType', id: 'myTest' }],
		_role_: 'links'
	},
	secondTest: 'mySecondTest',
	thirdTest: {
		link: { type: 'test', id: 'myThirdTest' },
		_role_: 'link'
	},
	fourthTest: {
		links: [{ type: 'TEST', id: 'myFourthTest' }],
		_role_: 'links'
	},
	fifthTest: {
		link: { type: 'testType', id: 'myFifthTest' },
		_role_: 'link'
	},
	sixthTest: {
		map: {
			mySixthTest: {
				type: 'type',
				id: 'id'
			}
		},
		_role_: 'map'
	},
	seventhTest: ''
};

test.only('form2data should return data from form values', async t => {
	t.deepEqual(form2data(values, fields), expected);
});
