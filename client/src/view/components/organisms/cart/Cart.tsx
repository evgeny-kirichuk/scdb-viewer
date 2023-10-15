import React, { useMemo } from 'react';
import cn from 'classnames';
import { useLocation } from 'react-router-dom';

import { useCart } from '~/view/contexts/cart/CartProvider';

import CartItemComponent from './CartItem';
import styles from './Cart.module.scss';

const Cart: React.FC = () => {
	const { cartItems } = useCart();

	const location = useLocation();
	const query = useMemo(
		() => new URLSearchParams(location.search),
		[location.search]
	);
	const showCartQuery = query.get('cart');

	const allItemsPrice = useMemo(() => {
		return cartItems.reduce((acc, item) => {
			return acc + (item.price || 0) * item.quantity;
		}, 0);
	}, [cartItems]);

	return (
		<div className={cn(styles.root, { [styles.open]: showCartQuery })}>
			<div className={styles.content}>
				<span className={styles.cartTitle}>
					{allItemsPrice > 0
						? `Total Price: ${allItemsPrice.toFixed(2)}`
						: 'Cart is empty'}
				</span>

				{cartItems.map((item) => {
					return <CartItemComponent key={item.id} item={item} />;
				})}
			</div>
		</div>
	);
};

export default Cart;
