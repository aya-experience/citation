import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';

let Cta;

const cta = { title: 'title', target: '/target' };

const setup = () => shallow(<Cta cta={cta} />);

let ctaShallow;

test.beforeEach(() => {
	Cta = proxyquire('./CTA', {}).default;
	ctaShallow = setup();
});

test('CTA should have a link to with given target', t => {
	t.deepEqual(ctaShallow.children().node.props.to, cta.target);
});

test('CTA should have a link to with given title', t => {
	t.deepEqual(
		ctaShallow
			.children()
			.children()
			.text(),
		cta.title
	);
});
