import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';

import { BookData } from '~/types';
import { BookPreview } from '~molecules/bookPreview/BookPreview';
import Input from '~atoms/input/Input';
import { cartActions } from '~view/contexts/cart/CartProvider';

import styles from './Home.module.scss';

const HomePage = () => {
	const [conneted, setConnected] = useState<boolean>(false);
	const [tables, setTables] = useState<any[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

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
				const data = await res.json();
				console.log(data);
				setConnected(true);
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

	const addBookToCart = (book: BookData) => {
		cartActions.addToCart(book);
	};

	useEffect(() => {
		// loadBooks(inputRef.current?.value || '');
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
