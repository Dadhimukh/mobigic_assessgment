import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../src/featuresRedux/store';

import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ReduxProvider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ReduxProvider>
    </StrictMode>
);
