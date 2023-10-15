import React from 'react';

import Button from '~atoms/button/Button';

import styles from './OfflineMessage.module.scss';

export const OfflineMessage: React.FC<{ onOkClick: () => void }> = ({
	onOkClick,
}) => {
	return (
		<div className={styles.wrapper}>
			<h1>No internet connection</h1>
			<h4>Please check your internet connection and try again</h4>
			<Button className={styles.okButton} onClick={onOkClick}>
				Okay
			</Button>
		</div>
	);
};
