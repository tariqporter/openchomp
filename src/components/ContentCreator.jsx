import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';
import loremIpsum from 'lorem-ipsum';
import { TextField, IconButton, Paper, Button, Grid, withStyles } from '@material-ui/core';
import { ModeComment, Delete } from '@material-ui/icons';
import RGL, { WidthProvider } from "react-grid-layout";
import './ContentCreator.scss';

const ReactGridLayout = WidthProvider(RGL);

const styles = (theme) => ({
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
    padding: theme.spacing.unit,
    // margin: theme.spacing.unit,
    overflow: 'hidden'
  },
  text: {
    width: '98%'
  },
  controls: {
    position: 'fixed',
    top: 0,
    right: 200
  }
});

class ContentCreator extends PureComponent {
  constructor(props) {
    super(props);

    const newId = uuidv4();

    this.state = {
      isDragging: false,
      newId,
      layout: [
        { i: uuidv4(), x: 0, y: 0, w: 19, h: 1 },
        { i: uuidv4(), x: 0, y: 1, w: 19, h: 1 },
        { i: uuidv4(), x: 0, y: 2, w: 19, h: 1 },
        { i: newId, x: 19, y: 0, w: 1, h: 1 }
      ]
    };

    this.state.fields = this.state.layout.filter(x => x.i !== newId).map(x => ({ i: x.i, text: loremIpsum({ count: 10 }) }));
    this.state.fields.push({ i: newId, text: 'Text Field' });
  }

  onLayoutChange = (layout) => {
    const c = layout.find(x => x.i === this.state.newId);
    if (c.x !== 19) {
      c.x = 0;
      c.w = 19;
      const newId = uuidv4();
      layout.push({ i: newId, x: 19, y: 0, w: 1, h: 1 });
      const fields = [...this.state.fields, { i: newId, text: 'Text Field' }];
      const field = fields.find(x => x.i === this.state.newId);
      field.text = loremIpsum({ count: 10 });
      this.setState({ newId, fields, layout });
    }
  }

  deleteComponent = (i) => {
    const fields = this.state.fields.filter(x => x.i !== i);
    this.setState({ fields });
    // console.log(e.target.parentNode);
  }

  render() {
    const { classes } = this.props;
    const { fields } = this.state;

    return (
      <div>
        <ReactGridLayout cols={20} onLayoutChange={this.onLayoutChange} layout={this.state.layout}>
          {fields.map((field) => (
            <Paper key={field.i} className={classes.paper}>
              <div className={classes.text}>{field.text}</div>
              {field.i !== this.state.newId &&
                <IconButton aria-label="Delete" className={classes.closeButton} onClick={() => this.deleteComponent(field.i)}>
                  <Delete fontSize="small" />
                </IconButton>
              }
            </Paper>
          ))}
        </ReactGridLayout>
      </div>
    );
  }
}

export default withStyles(styles)(ContentCreator);