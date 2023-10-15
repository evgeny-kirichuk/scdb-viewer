import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

import { BookData, CartItem } from '~/types';

interface CartContext {
	cartItems: CartItem[];
}

const CartContext = createContext<CartContext>({
	cartItems: [],
});

export let cartActions: {
	addToCart: (book: BookData) => void;
	updateQuantity: (bookId: string, quantity: number) => void;
	removeFromCart: (bookId: string) => void;
} = {
	addToCart: () => undefined,
	updateQuantity: () => undefined,
	removeFromCart: () => undefined,
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [cartItems, setItems] = useState<CartItem[]>([]);

	useEffect(() => {
		const cartItems = localStorage.getItem('cartItems');
		if (cartItems) {
			setItems(JSON.parse(cartItems));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('cartItems', JSON.stringify(cartItems));
	}, [cartItems]);

	const addToCart = (book: BookData) => {
		const bookInCart = cartItems.find((item) => item.id === book.id);
		if (!bookInCart) {
			setItems([...cartItems, { ...book, quantity: 1 }]);
		}
	};

	const removeFromCart = (bookId: string) => {
		const bookInCart = cartItems.find((item) => item.id === bookId);
		if (bookInCart) {
			setItems(cartItems.filter((item) => item.id !== bookId));
		}
	};

	const updateQuantity = (bookId: string, quantity: number) => {
		const bookInCart = cartItems.find((item) => item.id === bookId);
		if (bookInCart) {
			setItems(
				cartItems.map((item) => {
					if (item.id === bookId) {
						return { ...item, quantity };
					}
					return item;
				})
			);
		}
	};

	cartActions = { addToCart, removeFromCart, updateQuantity };

	return (
		<CartContext.Provider value={{ cartItems }}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	return useContext(CartContext);
};
