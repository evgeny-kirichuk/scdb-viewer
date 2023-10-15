import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '~molecules/footer/Footer';
import { Header } from '~organisms/header/Header';
import { OnlineStatusContext } from '~utils/OnlineStatusProvider';
import Portal from '~atoms/portal/Portal';
import { OfflineMessage } from '~molecules/offlineMessage/OfflineMessage';
import Cart from '~organisms/cart/Cart';

import styles from './Main.module.scss';

const Main: React.FC = () => {
	const online = useContext(OnlineStatusContext);
	const [showOfflineMessage, setShowOfflineMessage] = useState(!online);

	const closeOfflineMessage = () => setShowOfflineMessage(false);

	useEffect(() => {
		setShowOfflineMessage(!online);
	}, [online]);

	return (
		<div data-testid="root-layout" className={styles.layoutRoot}>
			<Header />
			<main className={styles.content}>
				<Outlet />
				<Cart />
			</main>
			<Footer />
			<Portal display={showOfflineMessage} onWrapperClick={closeOfflineMessage}>
				<OfflineMessage onOkClick={closeOfflineMessage} />
			</Portal>
		</div>
	);
};

export default Main;
