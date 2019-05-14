import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

// local import
import AppTheme from 'containers/AppTheme';
import theme from 'config/theme';
import AppRouter from 'routers/AppRouter';

class App extends Component {
	render() {
		return (
			<div className="rootDiv">
				<AppTheme theme={theme}>
					<AppRouter />
				</AppTheme>
			</div >
		);
	}
}

export default hot(module)(App);
