import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core';
// import { setContainerBoundsAction, setControlsContainerBoundsAction, changeTabAction } from '../redux/actions';

const cl = (...classArr) => classArr.join(' ');

const styles = {

};

class ContentPreview extends PureComponent {
  render() {
    const { controls } = this.props;
    return (
      <div>
        {
          Object.values(controls).filter(control => !control.isDragControl).map(control => (
            <div key={control.id}>{control.text}</div>
          ))
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  controls: state.controls
});

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ContentPreview));