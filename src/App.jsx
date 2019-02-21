import React, { PureComponent } from 'react';
import ContentCreator from './components/ContentCreator';
import { withStyles } from '@material-ui/core';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';

const styles = () => ({
  root: {
    padding: '20px 0 20px 100px'
  }
});

class App extends PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <ContentCreator />
      </div>
    );
  }
}

export default withStyles(styles)(App);