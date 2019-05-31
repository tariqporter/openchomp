import React, { PureComponent, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Paper, Tabs, Tab, withStyles, Tooltip } from '@material-ui/core';
import { setContentContainerBoundsAction, setControlsContainerBoundsAction, changeTabAction } from '../../redux/actions';
import DragControl from '../DragControl/DragControl';
import { Edit, Photo } from '@material-ui/icons';
import ContentPreview from '../ContentPreview/ContentPreview';
import { cl } from 'utils';

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
    this.controlsPortal = document.createElement('div');
    this.controlsPortal.id = 'controlsPortal';
    this.controlsPortal.style = "position:absolute;top:0;left:0;";
    document.body.appendChild(this.controlsPortal);
  }

  setContainerBounds = (ref) => {
    const { setContentContainerBounds } = this.props;
    if (ref) {
      const controlsPortalRect = this.controlsPortal.getBoundingClientRect();
      const rect = ref.getBoundingClientRect();
      setContentContainerBounds(rect.left, rect.top - controlsPortalRect.top, rect.width, rect.height);
    }
  }

  setControlsContainerBounds = (ref) => {
    const { setControlsContainerBounds } = this.props;
    if (ref) {
      const controlsPortalRect = this.controlsPortal.getBoundingClientRect();
      const rect = ref.getBoundingClientRect();
      setControlsContainerBounds(rect.left, rect.top - controlsPortalRect.top, rect.width, rect.height);
    }
  }

  setInputRef = (id, ref) => {
    this.inputRefs[id] = ref;
    if (ref) {
      setTimeout(() => { ref.focus(); });
    }
  }

  focus = (id) => {
    const ref = this.inputRefs[id];
    if (ref) {
      setTimeout(() => { ref.focus(); });
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
              {
                tabIndex === 1 &&
                <ContentPreview />
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
                      createPortal(
                        Object.values(controls).map(control => (
                          <DragControl key={control.id} {...control} setInputRef={this.setInputRef} focus={this.focus} />
                        )),
                        this.controlsPortal
                      )
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
  setContentContainerBounds: setContentContainerBoundsAction,
  setControlsContainerBounds: setControlsContainerBoundsAction,
  changeTab: changeTabAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ContentCreator));