import React from 'react';

import { render, screen } from '~/utils/testing/test-utils';

import App from './App';

describe('App tests', () => {
	it('App renders successfully', async () => {
		render(<App />);
		const element = await screen.findByTestId('root-layout');
		expect(element).toBeInTheDocument();
	});
});
