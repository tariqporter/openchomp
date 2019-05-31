import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core';

const styles = {
  root: {
    padding: 8
  }
};

class ContentPreview extends PureComponent {
  render() {
    const { classes, previewHtml } = this.props;
    return (
      <div className={classes.root}>
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  previewHtml: state.previewHtml
});

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ContentPreview));