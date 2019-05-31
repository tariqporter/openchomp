import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    wifth: '100%',
    height: 40,
    background: '#eee'
  }
});

class DragBar extends PureComponent {
  render() {
    const { classes, dragBarRef } = this.props;
    return (
      <div ref={dragBarRef} className={classes.root}></div>
    );
  }
}

export default withStyles(styles)(DragBar);
