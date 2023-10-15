import React, { memo, useState } from 'react';
import cn from 'classnames';

import { cartActions } from '~/view/contexts/cart/CartProvider';
import { CartItem } from '~/types';
import Button from '~atoms/button/Button';
import Input from '~atoms/input/Input';

import styles from './Cart.module.scss';

const CartItemComponent: React.FC<{ item: CartItem }> = memo(({ item }) => {
	const [isError, setIsError] = useState(false);

	const processQuantityInput = (
		e: React.ChangeEvent<HTMLInputElement>,
		item: CartItem
	) => {
		setIsError(false);
		const regex = /^(?!0+$)(?!-0{1,2}$)(0{0,2}\d{1,2}|100)$/;
		const quantityIsValid = regex.test(e.target.value);

		if (quantityIsValid) {
			cartActions.updateQuantity(item.id, Number(e.target.value));
		} else {
			setIsError(true);
		}
	};

	return (
		<div
			key={item.id}
			className={cn(styles.cartItem, { [styles.error]: isError })}
		>
			<div className={styles.itemTitle}>{item.title}</div>
			<Button
				className={styles.itemCloseButton}
				onClick={() => cartActions.removeFromCart(item.id)}
			>
				X
			</Button>
			<Input
				type="number"
				max={100}
				min={0}
				defaultValue={item.quantity}
				onChange={(e) => processQuantityInput(e, item)}
			/>
			<div className={styles.itemPrice}>
				<span>{item.price}</span>
				<span>{item.currency}</span>
			</div>
			{isError ? (
				<span className={styles.itemError}>Sorry! Number invalid.</span>
			) : null}
		</div>
	);
});

CartItemComponent.displayName = 'CartItemComponent';

export default CartItemComponent;
