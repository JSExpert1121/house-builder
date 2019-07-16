import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const style = (theme) => ({
  toolbarstyle: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.dark,
  },
  curTabPos: {},
  rootIcon: {
    marginBottom: '0 !important',
  }
});

const CustomTabs = ({ classes, tabs, init = 0 }) => {
  const [value, setValue] = useState(init);

  return (
    <AppBar position="static" className={classes.toolbarstyle}>
      <Tabs
        value={value}
        variant="scrollable"
        scrollButtons="on"
        onChange={(evt, newValue) => setValue(newValue)}
        indicatorColor="primary"
        textColor="primary"
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            component={Link}
            to={tab.href}
            label={tab.label}
            icon={tab.icon && <tab.icon className={classes.rootIcon} />}
          />
        ))}
      </Tabs>
    </AppBar>
  );
};

export default withStyles(style)(CustomTabs);
