import React, { PureComponent } from 'react';
import ContentCreator from './components/ContentCreator';
import { withStyles } from '@material-ui/core';

const styles = () => ({
  root: {
    padding: '20px 200px'
  }
});

class App extends PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <ContentCreator />
        <div id="controls"></div>
      </div>
    );
  }
}

export default withStyles(styles)(App);