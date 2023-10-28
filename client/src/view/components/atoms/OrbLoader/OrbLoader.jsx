import React from 'react';

import styles from './OrbLoader.module.scss';

export const OrbLoader = () => {
	const children = Array.from({ length: 300 }, (_, i) => (
		<div key={i} className={styles.c}></div>
	));

	return <div className={styles.wrap}>{children}</div>;
};

export default OrbLoader;
