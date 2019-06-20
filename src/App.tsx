import React from 'react';

import AppTheme from './containers/AppTheme';
import theme from './config/theme';
import AppRouter from './routers/AppRouter';

const App: React.FC = () => {
  return (
    <div className="rootDiv">
      <AppTheme theme={theme}>
        <AppRouter />
      </AppTheme>
    </div>
  );
};

export default App;
