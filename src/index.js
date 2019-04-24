import React from 'react'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import store from './store';

import WebFont from 'webfontloader';
import './styles/main.scss';

WebFont.load({
	google: {
		families: ['Niramit:300,400,500,600,700', 'sans-serif']
	}
});

render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	document.getElementById('app')
);