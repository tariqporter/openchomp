import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Paper, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import DraftEditor from './DraftEditor';
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

  changeTextControl = (editorState) => {
    const { id, changeTextControl } = this.props;
    changeTextControl(id, editorState);
  }

  deleteControl = () => {
    const { id, deleteControl } = this.props;
    deleteControl(id);
  }

  setInputRef = (ref) => {
    const { id, setInputRef } = this.props;
    setInputRef(id, ref);
  }

  focus = () => {
    const { id, focus } = this.props;
    focus(id);
  }

  render() {
    const { id, isDragControl, isDragging, placeholder, text, editorState, top, left, width, dropLeft, dropTop, dropWidth, dropHeight } = this.props;
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
                      <DraftEditor
                        forwardedRef={this.setInputRef}
                        className={cl(classes.text, classes.text_dragging)}
                        editorState={editorState}
                        onChange={() => { }}
                        readOnly
                      />
                    </Paper>
                  ) :
                  (
                    <Paper className={cl(classes.draggable, !isDragging && classes.draggable_dropped)} style={{ top, left, width }}>
                      <div className={cl(classes.dragBar, 'draggable-drag-bar')} />
                      <DraftEditor
                        onChange={this.changeTextControl}
                        forwardedRef={this.setInputRef}
                        className={classes.text}
                        editorState={editorState}
                        placeholder={placeholder}
                        onClick={this.focus}
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
