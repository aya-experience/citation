import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';

let Banner;

const image = { image: 'myImage' };
const children = ['children1'];

const setup = () => shallow(<Banner image={image}>{children}</Banner>);

let banner;

test.beforeEach(() => {
	Banner = proxyquire('./Banner', {}).default;
	banner = setup();
});

test('Banner components should have a child with image name', t => {
	t.deepEqual(banner.childAt(0).text(), image.image);
});

test('Banner components should have a child with children', t => {
	t.deepEqual(banner.childAt(1).find('.Banner-CTA').text(), children[0]);
});
