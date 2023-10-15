import React from 'react';
import cn from 'classnames';

import styles from './Input.module.scss';

const Input = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>(({ children, className, ...props }, ref) => {
	return (
		<input
			ref={ref}
			tabIndex={0}
			className={cn(styles.root, className)}
			{...props}
		>
			{children}
		</input>
	);
});

Input.displayName = 'Input';
export default Input;
