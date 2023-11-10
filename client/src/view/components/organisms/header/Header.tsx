import React from 'react';
import cn from 'classnames';
import { motion } from 'framer-motion';

import { useConnection } from '~/view/contexts/ConnectionProvider';

import styles from './Header.module.scss';

export const Header: React.FC = () => {
	const { connection, client } = useConnection();

	const connectionStatusText = () => {
		switch (connection.status) {
			case 'active':
				return Object.keys(client)[0];
			case 'loading':
				return 'Connecting...';
			case 'unknown':
				return '';
			default:
				return 'Unknown';
		}
	};

	return (
		<header className={styles.headerWrapper}>
			<div className={styles.headerItems}>
				<a className={styles.logoLink} href=".">
					<span className={styles.y}>SC</span>
					<span className={styles.js}>DB-VIEWER</span>
				</a>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.4 }}
					className={styles.sessionInfo}
				>
					<span style={{ gridColumn: 'span 2' }}>Client status:</span>
					<span className={styles.statusText}>{connectionStatusText()}</span>
					<span
						className={cn(styles.statusDott, {
							[styles.green]: connection.status === 'active',
							[styles.yellow]: connection.status === 'loading',
							[styles.grey]: connection.status === 'unknown',
						})}
					/>
				</motion.div>
			</div>
		</header>
	);
};
