import React, { Component } from 'react'
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import WebFont from 'webfontloader';

import './styles/main.scss';
import AppTheme from 'containers/AppTheme/AppTheme';
import theme from 'config/theme'
import AppRouter from 'routers/AppRouter';

import { Provider } from 'react-redux';
import store from './store';

WebFont.load({
	google: {
		families: ['Niramit:300,400,500,600,700', 'sans-serif']
	}
});

export default class App extends Component {
	render() {
		return (
			<div className="RootDiv">
				<AppTheme theme={theme}>
					<AppRouter />
				</AppTheme>
			</div>
		)
	}
}


render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	document.getElementById('app')
);