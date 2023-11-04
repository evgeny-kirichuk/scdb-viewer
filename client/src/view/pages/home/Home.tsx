import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { OrbLoader } from '~atoms/OrbLoader/OrbLoader';

// import { cartActions } from '~view/contexts/cart/CartProvider';

import { useConnection } from '~/view/contexts/ConnectionProvider';
import { ClusterPeer, LocalPeer } from '~/types';

import styles from './Home.module.scss';

type AnyObject = {
	[key: string]: any;
};

const ObjectTree: React.FC<AnyObject> = ({ data }) => {
	if (typeof data !== 'object') {
		// Render leaf nodes (non-object values)
		return <span>{data}</span>;
	}

	if (Array.isArray(data)) {
		// Render array nodes
		return (
			<ul>
				{data.map((item, index) => (
					<li key={index}>
						<ObjectTree data={item} />
					</li>
				))}
			</ul>
		);
	}

	// Render object nodes
	return (
		<ul>
			{Object.keys(data).map((key) => (
				<li key={key}>
					<strong>{key}: </strong>
					<ObjectTree data={data[key]} />
				</li>
			))}
		</ul>
	);
};

const HomePage = () => {
	const { connection } = useConnection();
	const [tables, setTables] = useState<AnyObject>({});
	const [peers, setPeers] = useState<{
		[key: string]: ClusterPeer | LocalPeer;
	}>({});
	const connected = connection.status === 'active';

	const peersByDC = useMemo(
		() =>
			Object.values(peers).reduce((acc, peer) => {
				if (peer.data_center in acc) {
					acc[peer.data_center].push(peer);
				} else {
					acc[peer.data_center] = [peer];
				}
				return acc;
			}, {} as { [key: string]: (ClusterPeer | LocalPeer)[] }),
		[peers]
	);

	const loadPeers = async () => {
		try {
			const res = await fetch(`http://localhost:8000/api/v1/cluster`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!res.ok) {
				return;
			}

			try {
				const data: { [key: string]: ClusterPeer | LocalPeer } =
					await res.json();
				setPeers(data);
			} catch (err) {
				console.log('ERROR', err);
			}
		} catch (err) {
			// process error with error tracking service
		}
	};

	const loadTables = async () => {
		try {
			const res = await fetch(`http://localhost:8000/api/v1/tables`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!res.ok) {
				return;
			}

			try {
				const data: AnyObject = await res.json();
				setTables(data);
			} catch (err) {
				console.log('ERROR', err);
			}
		} catch (err) {
			// process error with error tracking service
		}
	};

	useEffect(() => {
		if (connected) {
			loadPeers();
			loadTables();
		}
	}, [connected]);

	return (
		<div className={styles.wrapper}>
			{connection.status === 'active' ? (
				<motion.div
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -10, opacity: 0 }}
					transition={{ duration: 0.4 }}
					className={styles.pageContent}
				>
					<div>tabs</div>
					<div>tab content</div>
				</motion.div>
			) : (
				<OrbLoader />
			)}
			{/* <div className={styles.controls}>
				<button style={{ width: '200px', height: '40px' }} onClick={connect}>
					Connect
				</button>
				<span>{connectionStatus}</span>
				<button style={{ width: '200px', height: '40px' }} onClick={loadTables}>
					Load Tables
				</button>
			</div>
			<div className={styles.itemsGrid}>
				<ObjectTree data={cluster} />
			</div> */}
			{/* <div className={styles.itemsGrid}>
				{Object.keys(tables).map((key) => (
					<div key={tables[key].table_name} className={styles.item}>
						{tables[key].table_name}
					</div>
				))}
			</div> */}
		</div>
	);
};

export default HomePage;
