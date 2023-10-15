import React from 'react';

import { CartTrigger } from '~molecules/cartTrigger/CartTrigger';

import styles from './Header.module.scss';

export const Header: React.FC = () => {
	return (
		<header className={styles.headerWrapper}>
			<div className={styles.headerItems}>
				<a className={styles.logoLink} href=".">
					<span className={styles.y}>B</span>
					<span className={styles.js}>OOKS</span>
				</a>
				<CartTrigger />
			</div>
		</header>
	);
};
