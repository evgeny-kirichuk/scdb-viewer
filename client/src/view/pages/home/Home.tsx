import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';

import { BookData } from '~/types';
import { BookPreview } from '~molecules/bookPreview/BookPreview';
import Input from '~atoms/input/Input';
import { cartActions } from '~view/contexts/cart/CartProvider';

import styles from './Home.module.scss';

const HomePage = () => {
	const [books, setBooks] = useState<BookData[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const loadBooks = async () => {
		try {
			const res = await fetch(`http://localhost:8000/api/v1/tables`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});
			console.log(res);
			if (!res.ok) {
				return;
			}

			try {
				console.log('DATA1');
				const data: BookData[] = await res.json();
				console.log('DATA2', data);
			} catch (err) {
				console.log('ERROR', err);
			}
			// if (data) {
			// 	// setBooks(data);
			// }
		} catch (err) {
			// process error with error tracking service
		}
	};

	const handleInput = debounce((e) => {
		if (e.target.value !== '') {
			console.log('searching');
			loadBooks(e.target.value);
		}
	}, 500);

	const addBookToCart = (book: BookData) => {
		cartActions.addToCart(book);
	};

	useEffect(() => {
		loadBooks(inputRef.current?.value || '');
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
			<div className={styles.itemsGrid}>
				{books.map((book) => {
					return (
						<BookPreview key={book.id} book={book} onAdd={addBookToCart} />
					);
				})}
			</div>
		</div>
	);
};

export default HomePage;
