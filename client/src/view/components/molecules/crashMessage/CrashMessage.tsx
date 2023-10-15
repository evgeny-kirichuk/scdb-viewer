import React from 'react';

import Button from '~atoms/button/Button';

import styles from './CrashMessage.module.scss';

interface ICrash {
	click?: (r: string) => void;
}

const CrashMessage: React.FunctionComponent<ICrash> = ({ click }) => {
	return (
		<div className={styles.wrapper}>
			<h1>Something went wrong</h1>
			<Button
				className={styles.okButton}
				onClick={() => click && click('/home')}
			>
				Return
			</Button>
		</div>
	);
};

export default CrashMessage;
