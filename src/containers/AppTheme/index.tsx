import React, { FunctionComponent } from 'react';
import { MuiThemeProvider }         from '@material-ui/core/es/styles';
import { Theme }                    from '@material-ui/core';

type AppThemeProps = {
  theme: Theme;
  children: any;
};

const AppTheme: FunctionComponent<AppThemeProps> = ({ theme, children }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default AppTheme;
