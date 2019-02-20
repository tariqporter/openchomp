import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField, Paper, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { DraggableCore } from 'react-draggable';
import { startDragControlAction, dragControlAction, dropControlAction, changeTextControlAction, deleteControlAction } from '../redux/actions';
import classes from './DragControl.module.scss';

const cl = (...classArr) => classArr.join(' ');

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
    const { id, isDragControl, isDragging, placeholder, text, top, left, width, dropLeft, dropTop, dropWidth, dropHeight } = this.props;
    return (
      <div>
        {
          <DraggableCore
            onStart={this.onStart}
            onDrag={this.onDrag}
            onStop={this.onStop}
            handle=".draggable-drag-bar"
          >
            <div>
              {
                isDragging &&
                <div className={classes.dragIndicator} style={{ top: dropTop, left: dropLeft, width: dropWidth, height: dropHeight }} />
              }
              {
                isDragControl ?
                  (
                    <Paper className={cl(classes.draggable, 'draggable-drag-bar')} style={{ top, left, width }}>
                      <TextField
                        inputRef={this.setInputRef}
                        multiline
                        className={cl(classes.text, classes.text_dragging)}
                        disabled
                        value={text}
                      />
                    </Paper>
                  ) :
                  (
                    <Paper className={cl(classes.draggable, !isDragging && classes.draggable_dropped)} style={{ top, left, width }}>
                      <div className={cl(classes.dragBar, 'draggable-drag-bar')} />
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
          </DraggableCore>
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

export default connect(mapStateToProps, mapDispatchToProps)(DragControl);
