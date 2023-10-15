import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { CartItem } from '~/types';

import { CartProvider, cartActions } from './CartProvider';

describe('CartProvider', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should update quantity of a book in cart', async () => {
		const book = {
			id: '1',
			title: 'Sample Book',
			price: 10,
			description: '',
			pages: 10,
			currency: 'USD',
			quantity: 1,
		};

		const { rerender } = render(
			<CartProvider>
				<TestComponent book={book} />
			</CartProvider>
		);

		fireEvent.click(screen.getByText('Add to Cart'));
		const quantityInput = screen.getByRole('spinbutton');
		fireEvent.change(quantityInput, { target: { value: '3' } });
		fireEvent.blur(quantityInput);

		rerender(
			<CartProvider>
				<TestComponent book={{ ...book, quantity: 3 }} />
			</CartProvider>
		);

		fireEvent.click(screen.getByText('Update'));

		await waitFor(() => {
			const cartItems = JSON.parse(localStorage.getItem('cartItems') || '');
			expect(cartItems).toHaveLength(1);
			expect(cartItems[0]).toEqual({ ...book, quantity: 3 });
		});
	});
});

function TestComponent({ book }: { book: CartItem }) {
	const { addToCart, updateQuantity } = cartActions;

	return (
		<div>
			<button onClick={() => addToCart(book)}>Add to Cart</button>
			<input
				type="number"
				aria-label="Quantity"
				value={book.quantity || 1}
				onChange={(e) => updateQuantity(book.id, parseInt(e.target.value))}
			/>
			<button onClick={() => updateQuantity(book.id, book.quantity)}>
				Update
			</button>
		</div>
	);
}
