import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';

let TopMenu;

const link = { __id__: 'link', title: 'link', content: 'myLink' };
const links = [link];

const setup = () => shallow(<TopMenu links={links} />);

let topMenu;

test.beforeEach(() => {
	TopMenu = proxyquire('./TopMenu', {}).default;
	topMenu = setup();
});

test('Top Menu contains the Citation logo', t => {
	const imgProps = topMenu.find('img').props();
	t.true(imgProps.src.endsWith('logo.png'));
	t.is(imgProps.alt, 'Citation');
});

test('Top Menu show all links with content as href and title as text', t => {
	const mediaLink = topMenu.find('TopMenu__MediaLink');
	const mediaLinkLi = mediaLink.find('li');
	t.is(mediaLink.length, 1);
	t.is(mediaLink.props().href, link.content);
	t.is(mediaLinkLi.text(), link.title);
});
