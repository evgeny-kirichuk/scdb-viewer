import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';

import { BookData } from '~/types';
import Input from '~atoms/input/Input';
// import { cartActions } from '~view/contexts/cart/CartProvider';

import styles from './Home.module.scss';

type Status = {
	status: 'connected' | 'disconnected';
};

const HomePage = () => {
	const [connectionStatus, setConnectionStatus] = useState<
		'connected' | 'disconnected'
	>('disconnected');
	const [tables, setTables] = useState<any[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const checkStatus = async () => {
		try {
			const res = await fetch(`http://localhost:8000/api/v1/status`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!res.ok) {
				return;
			}

			try {
				const data: Status = await res.json();
				setConnectionStatus(data.status);
			} catch (err) {
				console.log(err);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const connect = async () => {
		try {
			const res = await fetch(`http://localhost:8000/api/v1/connect`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!res.ok) {
				return;
			}

			try {
				const data: Status = await res.json();
				setConnectionStatus(data.status);
			} catch (err) {
				console.log(err);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const loadTables = async () => {
		try {
			const res = await fetch(`http://localhost:8000/api/v1/tables`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			const r = await fetch(`http://localhost:8000/api/v1/cluster`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!res.ok) {
				return;
			}

			try {
				const data: BookData[] = await res.json();
				setTables(data);
			} catch (err) {
				console.log('ERROR', err);
			}
		} catch (err) {
			// process error with error tracking service
		}
	};

	const handleInput = debounce((e) => {
		if (e.target.value !== '') {
			console.log('searching');
			// loadBooks(e.target.value);
		}
	}, 500);

	useEffect(() => {
		// loadBooks(inputRef.current?.value || '');
		checkStatus();
	}, []);

	return (
		<div className={styles.wrapper}>
			<div className={styles.controls}>
				<Input
					ref={inputRef}
					className={styles.searchInput}
					placeholder="Search"
					defaultValue="nosql"
					onChange={handleInput}
				/>
			</div>
			<button style={{ width: '200px', height: '40px' }} onClick={connect}>
				Connect
			</button>
			<button style={{ width: '200px', height: '40px' }} onClick={loadTables}>
				Load Tables
			</button>
			<div className={styles.itemsGrid}>
				{Object.keys(tables).map((key) => (
					<div key={tables[key].table_name} className={styles.item}>
						{tables[key].table_name}
					</div>
				))}
			</div>
		</div>
	);
};

export default HomePage;
