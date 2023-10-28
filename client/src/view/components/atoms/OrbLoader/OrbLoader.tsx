import React from 'react';
import { motion } from 'framer-motion';

import styles from './OrbLoader.module.scss';

export const OrbLoader: React.FC = () => {
	const children = Array.from({ length: 300 }, (_, i) => (
		<div key={i} className={styles.c}></div>
	));

	return (
		<motion.div
			initial={{ y: 10, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: -10, opacity: 0 }}
			transition={{ duration: 0.2 }}
			className={styles.wrap}
		>
			{children}
		</motion.div>
	);
};

export default OrbLoader;
