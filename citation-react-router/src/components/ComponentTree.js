import React from 'react';
import { number, object, bool, func } from 'prop-types';
import { arrayMove } from 'react-sortable-hoc';

import Routes from '../Routes';
import ComponentControl, { NotSortableControl } from '../edition/ComponentControl';
import ComponentListControl from '../edition/ComponentListControl';
import Default from './Default';

const sortHandler = (content, refresh) => ({ oldIndex, newIndex }) => {
	window.parent.postMessage({ type: 'SORT_CHILDREN', content, oldIndex, newIndex }, '*');
	content.children = arrayMove(content.children, oldIndex, newIndex);
	refresh();
};

const ComponentTree = ({
	index,
	draggable,
	routesProps,
	page,
	content,
	parent,
	matchProps,
	refresh
}) => {
	const { type, props } = content;
	const children = content.children ? content.children : [];
	let Component = routesProps.components[type];

	if (Component === undefined) {
		Component = Default;
	}
	let childPage;
	if (Array.isArray(page.children)) {
		childPage = <Routes {...routesProps} {...matchProps} pages={page.children} />;
	}
	const parsedProps = {};
	if (Array.isArray(props)) {
		// eslint-disable-next-line react/prop-types
		props.forEach(prop => {
			const value = prop._value_ ? prop._value_ : prop._list_;
			parsedProps[prop._key_] = value;
		});
	}

	if (routesProps.context === '/edition') {
		const Control = draggable ? ComponentControl : NotSortableControl;
		return (
			<Control index={index} diabled={!draggable} content={content} parent={parent}>
				<Component {...parsedProps} pages={routesProps.pages} childPage={childPage}>
					<ComponentListControl
						content={content}
						useDragHandle
						onSortEnd={sortHandler(content, refresh)}
					>
						{children.map((child, i) => (
							<ComponentTree
								key={child._id_}
								index={i}
								draggable
								routesProps={routesProps}
								page={page}
								content={child}
								parent={content}
								matchProps={matchProps}
								refresh={refresh}
							/>
						))}
					</ComponentListControl>
				</Component>
			</Control>
		);
	}

	return (
		<Component {...parsedProps} pages={routesProps.pages} childPage={childPage}>
			{children.map(child => (
				<ComponentTree
					key={child._id_}
					routesProps={routesProps}
					page={page}
					content={child}
					matchProps={matchProps}
				/>
			))}
		</Component>
	);
};

ComponentTree.propTypes = {
	index: number,
	draggable: bool,
	routesProps: object,
	page: object,
	content: object,
	parent: object,
	matchProps: object,
	refresh: func
};

export default ComponentTree;
