import React from 'react';
import { createRoot } from 'react-dom/client';

import App from '~app/App';

import './index.scss';

const rootNode = document.getElementById('root') as Element;
const root = createRoot(rootNode);

root.render(<App />);
