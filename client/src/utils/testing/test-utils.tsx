import React, { ReactElement } from 'react';
import { RenderOptions, render } from '@testing-library/react';

import { CartProvider } from '../../view/contexts/cart/CartProvider';
import { ThemeProvider } from '../../view/theme';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: jest.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: jest.fn(), // deprecated
			removeListener: jest.fn(), // deprecated
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		})),
	});

	return (
		<ThemeProvider>
			<CartProvider>{children}</CartProvider>
		</ThemeProvider>
	);
};

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
