import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';

let TopMenu;

const docs = {
	__id__: 'docs',
	children: [{ id: 'doc1', slug: 'slugDoc1', title: 'doc 1' }]
};
const other = { id: 'other', slug: 'other', title: 'other doc' };
const pages = [
	{
		__id__: 'home',
		children: [docs, other]
	}
];
const link = { id: 'link', title: 'link', content: 'myLink' };
const links = [link];

const setup = () => shallow(<TopMenu pages={pages} links={links} />);

let topMenu;

let docsUl;
let othersUl;
let linksUl;

test.beforeEach(() => {
	TopMenu = proxyquire('./TopMenu', {}).default;
	topMenu = setup();
	docsUl = topMenu.childAt(0).childAt(0);
	othersUl = topMenu.childAt(1).childAt(0);
	linksUl = topMenu.childAt(2).childAt(0);
});

test('Top Menu docs children should be display in a Link with id as key', t => {
	t.deepEqual(docsUl.node.key, docs.children[0].id);
});

test('Top Menu docs children should be display in a Link with slug as target', t => {
	t.deepEqual(docsUl.node.props.to, `/docs/${docs.children[0].slug}`);
});

test('Top Menu docs children should be display in a Link with title', t => {
	t.deepEqual(docsUl.children().text(), docs.children[0].title);
});

test('Top Menu other children should be display in a Link with id as key', t => {
	t.deepEqual(othersUl.node.key, other.id);
});

test('Top Menu other children should be display in a Link with slug as target', t => {
	t.deepEqual(othersUl.node.props.to, `/${other.slug}`);
});

test('Top Menu other children should be display in a Link with title', t => {
	t.deepEqual(othersUl.children().text(), other.title);
});

test('Top Menu link should be display in a Link with id as key', t => {
	t.deepEqual(linksUl.node.key, link.id);
});

test('Top Menu link should be display in a Link with content as target', t => {
	t.deepEqual(linksUl.node.props.href, link.content);
});

test('Top Menu link should be display in a Link with title', t => {
	t.deepEqual(linksUl.children().text(), link.title);
});
