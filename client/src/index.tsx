import React from 'react';
import { createRoot } from 'react-dom/client';

import App from '~app/App';

import {
	registerServiceWorker,
	unregisterServiceWorker,
} from './serviceWorkerRegistration.js';

import './index.scss';

const shouldInstallServiceWorker = process.env.APP_STAND !== 'local';

const rootNode = document.getElementById('root') as Element;
const root = createRoot(rootNode);

root.render(<App />);

if (shouldInstallServiceWorker) {
	registerServiceWorker();
}

if (!shouldInstallServiceWorker) {
	unregisterServiceWorker();
}
