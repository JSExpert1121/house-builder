import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// import local
import App from './App';
import store from './store';

// Global Styles
import './styles/index.scss';

// Extra Modules
import WebFont from 'webfontloader';

import * as serviceWorker from './serviceWorker';

WebFont.load({
    google: {
        families: ['Niramit:300,400,500,600,700', 'sans-serif']
    }
});

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
