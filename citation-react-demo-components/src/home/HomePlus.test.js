import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';

let HomePlus;

const plus = {
	title: 'homePlus',
	align: 'left',
	image: 'plusImage',
	content: 'PlusContent'
};

const setup = () => shallow(<HomePlus plus={[plus]} />);

let homePlus;
let homePlusDiv;
let homePlusBlock;

test.beforeEach(() => {
	HomePlus = proxyquire('./HomePlus', {}).default;
	homePlus = setup();
	homePlusDiv = homePlus.childAt(0);
	homePlusBlock = homePlusDiv.find(`[align="${plus.align}"]`);
});

test('HomePlus should have a div with HomePlus title as key', t => {
	t.deepEqual(homePlusDiv.nodes[0].key, plus.title);
});

test('HomePlus should have a div with align className', t => {
	t.is(homePlusBlock.length, 1);
});

test('HomePlus should have image name', t => {
	t.deepEqual(homePlusBlock.childAt(1).text(), plus.image);
});

test('HomePlus should have image name', t => {
	t.deepEqual(
		homePlusBlock
			.childAt(2)
			.shallow()
			.text(),
		`${plus.title}${plus.content}`
	);
});
