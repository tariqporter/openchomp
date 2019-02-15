import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField, Paper, IconButton, withStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { DraggableCore } from 'react-draggable';
import { startDragControlAction, dragControlAction, dropControlAction, changeTextControlAction, deleteControlAction } from '../redux/actions';

const cl = (...classArr) => classArr.join(' ');

const styles = theme => ({
  child: {
    position: 'absolute',
    cursor: 'pointer',
    // width: '100%'
  },
  text: {
    width: `calc(100% - ${theme.spacing.unit * 2}px)`,
    transition: "all .3s",
    margin: theme.spacing.unit,
    minHeight: 100,
    "&.dragging": {
      minHeight: 20,
      "& input,textarea": {
        cursor: 'pointer'
      }
    }
  },
  dragBar: {
    height: 20,
    background: '#eee'
  },
  deleteButton: {
    position: 'absolute',
    right: 2,
    top: 2
  },
  dragIndicator: {
    position: 'absolute',
    borderRadius: theme.spacing.unit / 2,
    background: 'red',
    height: 48,
    opacity: .1
  }
});

class DragControl extends PureComponent {

  onStart = (e, context) => {
    const { id, startDragControl } = this.props;
    startDragControl(id);
  }

  onDrag = (e, context) => {
    const { id, dragControl } = this.props;
    const { deltaX, deltaY } = context;
    dragControl(id, deltaX, deltaY);
  }

  onStop = (e, context) => {
    const { id, dropControl } = this.props;
    dropControl(id);
  }

  changeTextControl = (e) => {
    const { id, changeTextControl } = this.props;
    changeTextControl(id, e.target.value);
  }

  deleteControl = () => {
    const { id, deleteControl } = this.props;
    deleteControl(id);
  }

  setInputRef = (ref) => {
    const { id, setInputRef } = this.props;
    setInputRef(id, ref);
  }

  render() {
    const { classes, isDragControl, placeholder, text, top, left, width, dropLeft, dropTop, dropWidth, dropHeight } = this.props;
    return (
      <div>
        {
          isDragControl ?
            (
              <DraggableCore
                onStart={this.onStart}
                onDrag={this.onDrag}
                onStop={this.onStop}
              >
                <div>
                  <div className={classes.dragIndicator} style={{ top: dropTop, left: dropLeft, width: dropWidth, height: dropHeight }}></div>
                  <Paper className={classes.child} style={{ top, left, width }}>
                    <TextField
                      multiline
                      className={cl(classes.text, 'dragging')}
                      disabled
                      value={text}
                    />
                  </Paper>
                </div>
              </DraggableCore>
            ) :
            (
              <Paper className={classes.child} style={{ top, left, width }}>
                <div className={classes.dragBar}></div>
                <TextField
                  onChange={this.changeTextControl}
                  inputRef={this.setInputRef}
                  multiline
                  className={classes.text}
                  value={text}
                  placeholder={placeholder}
                />
                <IconButton className={classes.deleteButton} onClick={this.deleteControl}>
                  <Delete />
                </IconButton>
              </Paper>
            )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => bindActionCreators({
  changeTextControl: changeTextControlAction,
  startDragControl: startDragControlAction,
  dragControl: dragControlAction,
  dropControl: dropControlAction,
  deleteControl: deleteControlAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DragControl));
