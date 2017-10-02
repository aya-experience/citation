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
	test: [{ __id__: 'myTest', __type__: 'testType' }],
	secondTest: 'mySecondTest',
	thirdTest: { __id__: 'myThirdTest' },
	fourthTest: [{ __id__: 'myFourthTest' }],
	fifthTest: { __id__: 'myFifthTest', __type__: 'testType' },
	sixthTest: [{ __key__: 'mySixthTest', __value__: { __id__: 'id', __type__: 'type' } }],
	seventhTest: null
};
const expected = {
	test: {
		links: [{ type: 'testType', id: 'myTest' }],
		__role__: 'links'
	},
	secondTest: 'mySecondTest',
	thirdTest: {
		link: { type: 'test', id: 'myThirdTest' },
		__role__: 'link'
	},
	fourthTest: {
		links: [{ type: 'TEST', id: 'myFourthTest' }],
		__role__: 'links'
	},
	fifthTest: {
		link: { type: 'testType', id: 'myFifthTest' },
		__role__: 'link'
	},
	sixthTest: {
		map: {
			mySixthTest: {
				type: 'type',
				id: 'id'
			}
		},
		__role__: 'map'
	},
	seventhTest: ''
};

test.only('form2data should return data from form values', async t => {
	t.deepEqual(form2data(values, fields), expected);
});
