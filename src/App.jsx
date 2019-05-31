import React, { PureComponent } from 'react';
import ContentCreator from './components/ContentCreator/ContentCreator';
import { withStyles } from '@material-ui/core';

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