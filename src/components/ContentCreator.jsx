import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Paper, Tabs, Tab, withStyles, Tooltip } from '@material-ui/core';
import { setContainerBoundsAction, setControlsContainerBoundsAction, changeTabAction } from '../redux/actions';
import DragControl from './DragControl';
import { Edit, Photo } from '@material-ui/icons';

const cl = (...classArr) => classArr.join(' ');

const styles = {
  container: {
    background: '#ccc',
    height: '100vh',
    position: 'relative',
  },
  left: {
    background: '#ddd'
  }
};

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

  changeTab = (e, tabIndex) => {
    const { changeTab } = this.props;
    changeTab(tabIndex);
  }

  render() {
    const { classes, controls, tabIndex } = this.props;
    return (
      <div>
        <Grid container>
          <Grid item xs={8}>
            <Paper>
              <Tabs value={tabIndex} onChange={this.changeTab}>
                <Tab icon={<Tooltip title="Edit" aria-label="Edit"><Edit /></Tooltip>} />
                <Tab icon={<Tooltip title="Preview" aria-label="Preview"><Photo /></Tooltip>} />
              </Tabs>
              {
                tabIndex === 0 &&
                <div className={cl(classes.container, classes.left)} ref={this.setContainerBounds} />
              }
            </Paper>
          </Grid>
          {
            tabIndex === 0 &&
            <Fragment>
              <Grid item xs={1} />
              <Grid item xs={3}>
                <Paper>
                  <div className={classes.container} ref={this.setControlsContainerBounds}>
                    {
                      Object.values(controls).map(control => (
                        <DragControl key={control.id} {...control} setInputRef={this.setInputRef} />
                      ))
                    }
                  </div>
                </Paper>
              </Grid>
            </Fragment>
          }
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  controls: state.controls,
  tabIndex: state.tabIndex
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setContainerBounds: setContainerBoundsAction,
  setControlsContainerBounds: setControlsContainerBoundsAction,
  changeTab: changeTabAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ContentCreator));