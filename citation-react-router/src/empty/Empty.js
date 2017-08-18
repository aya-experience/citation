import React from 'react';

const styles = {
	container: {
		display: 'flex',
		paddingTop: '5rem',
		flexDirection: 'column',
		alignItems: 'center'
	},
	title: {}
};

const Empty = () =>
	<main style={styles.container}>
		<h1>Welcome to Citation!</h1>
		<p>Your site configuration seems empty.</p>
		<p>You should go to the administration to create your first pages</p>
		<p>
			<a href="/admin">Administration</a>
		</p>
	</main>;

export default Empty;
