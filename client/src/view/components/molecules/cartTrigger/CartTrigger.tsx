import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCart } from '~/view/contexts/cart/CartProvider';
import Button from '~atoms/button/Button';

export const CartTrigger: React.FC = () => {
	const { cartItems } = useCart();
	const navigate = useNavigate();
	const location = useLocation();
	const query = useMemo(
		() => new URLSearchParams(location.search),
		[location.search]
	);
	const showCartQuery = query.get('cart');

	const handleCart = () => {
		navigate({
			pathname: location.pathname,
			search: showCartQuery ? '' : '?cart=open',
		});
	};

	return (
		<Button
			data-testid="cart-trigger-button"
			onClick={handleCart}
		>{`Cart (${cartItems.length})`}</Button>
	);
};
