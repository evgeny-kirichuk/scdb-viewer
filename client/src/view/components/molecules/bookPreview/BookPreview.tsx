import React from 'react';

import { BookData } from '~/types';
import Button from '~atoms/button/Button';

import styles from './BookPreview.module.scss';

export const BookPreview: React.FC<{
	book: BookData;
	onAdd: (book: BookData) => void;
}> = ({ book, onAdd }) => {
	return (
		<div className={styles.root}>
			{book.image ? (
				<img
					className={styles.previewImage}
					src={book.image}
					alt={book.title}
				/>
			) : (
				<div className={styles.previewImagePlaceholder}>{book.title}</div>
			)}
			<div className={styles.bookDetails}>
				<span className={styles.title}>{book.title}</span>
				<span className={styles.description}>{book.description}</span>
				{book.revision ? (
					<div className={styles.revision}>revision: {book.revision}</div>
				) : (
					<div />
				)}
				<div className={styles.price}>
					{book.price ? book.price + ' ' + book.currency : 'Out of sale'}
				</div>
				<Button disabled={!book.price} onClick={() => onAdd(book)}>
					Add to cart
				</Button>
			</div>
		</div>
	);
};

BookPreview.displayName = 'BookPreview';
