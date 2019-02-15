import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, withStyles } from '@material-ui/core';
import { setContainerBoundsAction, setControlsContainerBoundsAction } from '../redux/actions';
import DragControl from './DragControl';

const cl = (...classArr) => classArr.join(' ');

const styles = theme => ({
  container: {
    background: '#ccc',
    minHeight: 450,
    padding: theme.spacing.unit
  },
  innerContainer: {
    position: 'relative',
  },
  left: {
    background: '#ddd'
  }
});

class ContentCreator extends PureComponent {
  constructor(props) {
    super(props);
    this.inputRefs = {};
  }

  setContainerBounds = (ref) => {
    if (ref) {
      const rect = ref.getBoundingClientRect();
      this.props.setContainerBounds(rect.left, rect.top, rect.width, rect.height);
    }
  }

  setControlsContainerBounds = (ref) => {
    if (ref) {
      const rect = ref.getBoundingClientRect();
      this.props.setControlsContainerBounds(rect.left, rect.top, rect.width, rect.height);
    }
  }

  setInputRef = (id, ref) => {
    this.inputRefs[id] = ref;
    if (ref) {
      ref.focus();
    }
  }

  render() {
    const { classes, controls } = this.props;
    return (
      <div>
        <Grid container>
          <Grid item xs={8}>
            <div className={cl(classes.container, classes.left)} ref={this.setContainerBounds}></div>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.container}>
              <div className={classes.innerContainer} ref={this.setControlsContainerBounds}>
                {
                  controls.map(control => (
                    <DragControl key={control.id} {...control} setInputRef={this.setInputRef} />
                  ))
                }
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  controls: state.controls
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setContainerBounds: setContainerBoundsAction,
  setControlsContainerBounds: setControlsContainerBoundsAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ContentCreator));