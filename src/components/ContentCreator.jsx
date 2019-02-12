import React, { PureComponent, Fragment } from 'react';
// import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';
// import loremIpsum from 'lorem-ipsum';
import { TextField, IconButton, Paper, Button, Grid, withStyles } from '@material-ui/core';
import { ModeComment, Delete } from '@material-ui/icons';
// import RGL, { WidthProvider } from "react-grid-layout";
import { DraggableCore } from 'react-draggable';
import './ContentCreator.scss';

// const ReactGridLayout = WidthProvider(RGL);

const styles = (theme) => ({
  child: {
    position: 'absolute',
    // border: '1px #000 solid',
    // borderRadius: 5,
    // padding: theme.spacing.unit * 2,
    cursor: 'pointer',
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    right: 2,
    top: 2
  },
  draggable: {
    // position: 'relative',
    // background: 'red',
    // width: 100,
    // height: 100
  },
  field: {
    margin: '20px 0'
  },
  paper: {
    // minHeight: 200,
    // padding: theme.spacing.unit,
    // margin: theme.spacing.unit,
    // overflow: 'hidden'
    height: 'auto'
  },
  text: {
    width: `calc(100% - ${theme.spacing.unit * 2}px)`,
    transition: "all .3s",
    // width: '98%',
    // height: '100%',
    // overflow: 'hidden'

    margin: theme.spacing.unit,
    minHeight: 200,

    // "& input": {
    //   cursor: 'default'
    // },

    "&.dragging": {
      minHeight: 20,
      "& input,textarea": {
        cursor: 'pointer'
      }
    }
  },
  container: {
    // position: 'fixed',
    // top: 0,
    // right: 200
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

const cl = (...classArr) => {
  return classArr.join(' ');
};

class DragBar extends PureComponent {
  render() {
    const { dragBarRef } = this.props;
    return (
      <div ref={dragBarRef} style={{ wifth: '100%', height: 40, background: '#eee' }}></div>
    );
  }
}

class DragControl extends PureComponent {
  render() {
    const { control, classes, onKeyChange, deleteControl, inputRef, dragBarRef } = this.props;
    return (
      <Paper key={control.id} className={classes.child} style={control}>
        {
          !control.isDragControl &&
          <Fragment>
            <DragBar dragBarRef={dragBarRef} />
            <IconButton className={classes.closeButton} onClick={deleteControl}>
              <Delete />
            </IconButton>
          </Fragment>
        }
        <TextField
          inputRef={inputRef}
          onChange={onKeyChange}
          multiline
          // classes={{ MuiInputBase: { root: 'my-class-name' } }}
          className={cl(classes.text, control.isDragControl && 'dragging')}
          disabled={control.isDragControl}
          value={control.text}
          placeholder={control.placeholder}
        />
      </Paper>
    );
  }
}

class ContentCreator extends PureComponent {
  constructor(props) {
    super(props);

    this.isDragging = false;
    this.dragControlRefs = {};
    this.dragBarRefs = {};

    this.state = {
      nextId: 1,
      defaultControl: { id: 0, left: 0, top: 0, width: null, zIndex: 1, isDragControl: true, text: 'Text Block', placeholder: '' },
      controls: [
        { id: 0, left: 0, top: 0, width: null, zIndex: 1, isDragControl: true, text: 'Text Block', placeholder: '' },
        // { id: 1, left: 0, top: 75, width: null, zIndex: 1, isDragControl: true, text: 'Text Block', placeholder: '' }
      ]
    };
  }

  onStart = (id, e, { node, deltaX, deltaY }) => {
    const control = this.state.controls.find(c => c.id === id);
    if (!control.isDragControl && e.target === this.dragBarRefs[id]) {
      this.isDragging = true;
    }

    const { offsetParent } = node;
    const parentRect = offsetParent.getBoundingClientRect();
    const clientRect = node.getBoundingClientRect();
    const controls = this.state.controls.map(c => {
      if (c.id === id) {
        const newPosition = {
          top: c.top + clientRect.top - parentRect.top + offsetParent.scrollTop,
          left: c.left + clientRect.left - parentRect.left + offsetParent.scrollLeft,
          zIndex: 99
        };
        return { ...c, ...newPosition };
      }
      return c;
    });
    this.setState({ controls });
  }

  onDrag = (id, e, { node, deltaX, deltaY }) => {
    const control = this.state.controls.find(c => c.id === id);
    if (!control.isDragControl && !this.isDragging) return;

    const controls = this.state.controls.map(c => {
      if (c.id === id) {
        const newPosition = { top: c.top + deltaY, left: c.left + deltaX };
        return { ...c, ...newPosition };
      }
      return c;
    });
    this.setState({ controls });
  }

  onStop = (id, e, { node, deltaX, deltaY }) => {
    this.isDragging = false;
    const controlsContainerRect = this.controlsContainerRef.getBoundingClientRect();
    const containerRect = this.containerRef.getBoundingClientRect();
    const controls = this.state.controls.map(c => {
      if (c.id === id) {
        const newPosition = {
          left: containerRect.x - controlsContainerRect.x,
          width: containerRect.width,
          isDragControl: false,
          text: '',
          placeholder: 'Type some content',
          zIndex: 99
        };
        return { ...c, ...newPosition };
      }
      return c;
    });
    controls.push({ ...this.state.defaultControl, id: this.state.nextId });
    this.setState(state => ({ controls, nextId: state.nextId + 1 }), () => {
      this.dragControlRefs[id].select();
    });
    console.log(this.state.controls.length)
  }

  onKeyChange = (id, e) => {
    const text = e.target.value;
    const controls = this.state.controls.map(c => {
      if (c.id === id) {
        const newPosition = { text };
        return { ...c, ...newPosition };
      }
      return c;
    });
    this.setState({ controls });
  };

  setDragControlRef = (id, ref) => {
    this.dragControlRefs[id] = ref;
  }

  setDragBarRef = (id, ref) => {
    this.dragBarRefs[id] = ref;
  }

  deleteControl = (id) => {
    const controls = this.state.controls.filter(c => c.id !== id);
    this.setState({ controls });
  }

  render() {
    const { classes } = this.props;
    const { controls } = this.state;

    return (
      <div>
        <Grid container>
          <Grid item xs={8}>
            <div className={cl(classes.container, classes.left)} ref={r => this.containerRef = r}></div>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.container}>
              <div className={classes.innerContainer} ref={r => this.controlsContainerRef = r}>
                {controls.map(control => {
                  return (
                    <DraggableCore
                      key={control.id}
                      onStart={this.onStart.bind(this, control.id)}
                      onDrag={this.onDrag.bind(this, control.id)}
                      onStop={this.onStop.bind(this, control.id)}
                    >
                      <div>
                        <DragControl
                          inputRef={r => this.setDragControlRef(control.id, r)}
                          dragBarRef={r => this.setDragBarRef(control.id, r)}
                          control={control}
                          onKeyChange={this.onKeyChange.bind(this, control.id)}
                          deleteControl={this.deleteControl.bind(this, control.id)}
                          classes={classes}
                        />
                      </div>
                    </DraggableCore>
                  );
                })}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ContentCreator);