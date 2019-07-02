import React from 'react';

import AppTheme  from './containers/AppTheme';
import theme     from './config/theme';
import AppRouter from './routers/AppRouter';

const App: React.FC = () => {
  return (
    <AppTheme theme={theme}>
      <AppRouter />
    </AppTheme>
  );
};

export default App;
