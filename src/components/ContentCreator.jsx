import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';
import loremIpsum from 'lorem-ipsum';
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

class ContentCreator extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      controls: [
        { id: 0, left: 0, top: 0, width: null, zIndex: 1, isDragControl: true, text: 'Text Block' },
        { id: 1, left: 0, top: 75, width: null, zIndex: 1, isDragControl: true, text: 'Text Block' }
      ]
    };
  }

  onStart = (id, e, { node, deltaX, deltaY }) => {
    const { offsetParent } = node;
    const parentRect = offsetParent.getBoundingClientRect();
    const clientRect = node.getBoundingClientRect();
    const newPosition = { top: 0, left: 0 };
    newPosition.left = clientRect.left - parentRect.left + offsetParent.scrollLeft;
    newPosition.top = clientRect.top - parentRect.top + offsetParent.scrollTop;
    const controls = [...this.state.controls];
    const control = controls.find(x => x.id === id);
    control.top = newPosition.top;
    control.left = newPosition.left;
    control.zIndex = 99;
    this.setState({ controls });
  }

  onDrag = (id, e, { node, deltaX, deltaY }) => {

    const controls = [...this.state.controls];
    const control = controls.find(x => x.id === id);

    const newPosition = { top: 0, left: 0 };
    newPosition.left = control.left + deltaX;
    newPosition.top = control.top + deltaY;

    // const docRect = document.body.getBoundingClientRect();
    // const controlsContainerRect = this.controlsContainerRef.getBoundingClientRect();
    // const containerRect = this.containerRef.getBoundingClientRect();

    // const x = controlsContainerRect.x + newPosition.left - containerRect.x;
    // const y = controlsContainerRect.y + newPosition.top - containerRect.y;
    // console.log(y, controlsContainerRect, containerRect, newPosition);

    control.top = newPosition.top;
    control.left = newPosition.left;
    this.setState({ controls });
  }

  onStop = (id, e, { node, deltaX, deltaY }) => {
    const controls = [...this.state.controls];
    const control = controls.find(x => x.id === id);
    control.zIndex = 1;
    const controlsContainerRect = this.controlsContainerRef.getBoundingClientRect();
    const containerRect = this.containerRef.getBoundingClientRect();
    control.left = containerRect.x - controlsContainerRect.x;
    control.width = containerRect.width;
    control.isDragControl = false;
    control.text = loremIpsum({ count: 10 });
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
                  return (control.isDragControl ?
                    <DraggableCore
                      key={control.id}
                      onStart={this.onStart.bind(this, control.id)}
                      onDrag={this.onDrag.bind(this, control.id)}
                      onStop={this.onStop.bind(this, control.id)}
                    >
                      <Paper className={classes.child} style={control}>
                        <TextField
                          multiline
                          className={cl(classes.text, control.isDragControl && 'dragging')}
                          disabled={control.isDragControl}
                          value={control.text}
                        />
                      </Paper>
                    </DraggableCore> :
                    <Paper key={control.id} className={classes.child} style={control}>
                      <TextField
                        multiline
                        className={cl(classes.text, control.isDragControl && 'dragging')}
                        disabled={control.isDragControl}
                        value={control.text}
                      />
                    </Paper>);
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