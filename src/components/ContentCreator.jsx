import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';
import loremIpsum from 'lorem-ipsum';
import { TextField, Paper, Button, Grid, withStyles } from '@material-ui/core';
import { ModeComment } from '@material-ui/icons';
import './ContentCreator.scss';

const styles = (theme) => ({
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
    margin: theme.spacing.unit,
    overflow: 'hidden'
  },
  controls: {
    position: 'fixed',
    top: 0,
    right: 200
  }
});

const newPaperPlaceholder = 'Enter text here...'

const NewPaper = withStyles(styles)((props) => {
  const { classes } = props;
  // const li = loremIpsum({ count: 10 });
  // console.log(li);
  return (<Paper
    style={{ background: 'red' }}
    className={`${classes.paper}`}>
    {newPaperPlaceholder}
  </Paper>);
});

class ContentCreator extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isDragging: false,
      fields: [
        { id: uuidv4(), text: loremIpsum({ count: 10 }) },
        { id: uuidv4(), text: loremIpsum({ count: 10 }) }
      ],
      addedFieldIds: []
    };

    this.el = document.createElement('div');
    this.draggingEl = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  setFielContainerRef = (ref) => {
    this.fieldContainerRef = ref;
    if (this.fieldContainerRef) {

      const mouseup = (e) => {
        // console.log('here')
        if (this.state.isDragging) {
          this.draggingEl.parentNode.removeChild(this.draggingEl);
          const childNodes = Array.from(this.fieldContainerRef.childNodes);
          // console.log(e, e.clientY, childNodes.map(x => x.getBoundingClientRect().top));
          // console.log(childNodes);
          // console.log(e, e.clientY, childNodes[0].offsetTop, childNodes[1].offsetTop);
          let index = 0;
          for (let i = childNodes.length - 1; i >= 0; i--) {
            const top = childNodes[i].getBoundingClientRect().top;
            // console.log(e.screenY, top)
            if (e.clientY > top) {
              index = i + 1;
              break;
            }
          }

          // console.log(e, childNodes[0].offsetTop);
          const fields = [...this.state.fields];
          const newPaper = { id: uuidv4(), text: newPaperPlaceholder }
          fields.splice(index, 0, newPaper);
          this.setState(state => ({ fields, addedFieldIds: [...state.addedFieldIds, newPaper.id] }));
          setTimeout(() => {
            const addedFieldIds = [...this.state.addedFieldIds];
            const index2 = addedFieldIds.findIndex(x => x.id === newPaper);
            addedFieldIds.splice(index2, 1);
            this.setState(state => ({ addedFieldIds }));
          }, 2000);
        }
        // this.isDragging = false;
      };
      this.fieldContainerRef.addEventListener('mouseup', mouseup);
    }
  }

  setDraggableRef = (ref) => {
    this.draggableRef = ref;
    if (this.draggableRef) {
      const mousedown = (e1) => {
        this.setState(state => ({ isDragging: true }));
        // this.isDragging = true;
        // this.draggableRef.style.position = 'absolute';
        // this.draggableRef.style['pointer-events'] = 'none';
        const sx = e1.x;
        const sy = e1.y;
        // console.log(e1, sx);
        // let t = false;

        const mousemove = (e2) => {
          e2.preventDefault();
          // console.log(e2);
          const target = e2.target;
          // if (!target.parentElement.contains())
          // && !target.parentElement.contains(this.draggingEl)

          const x = e2.x;
          const y = e2.y;

          if (target.parentElement && this.fieldContainerRef.contains(target)) {
            if (!this.draggingEl.contains(target.parentNode)) {
              // console.log(this.draggingEl, target.parentNode);
              const b1 = target.getBoundingClientRect();
              // console.log(y, b1);
              if (y > b1.y + b1.height / 2) {
                target.parentNode.insertBefore(this.draggingEl, target.nextSibling);
              } else {
                target.parentNode.insertBefore(this.draggingEl, target);
              }
            }
          }

          // console.log(x, sx, x - sx)
          // this.draggableRef.style.left = `${x - sx}px`;
          // this.draggableRef.style.top = `${y - sy}px`;
        };
        document.addEventListener('mousemove', mousemove);

        const mouseup = (e3) => {
          document.removeEventListener('mousemove', mousemove);
          // this.draggableRef.style.position = 'relative';
          // this.draggableRef.style.left = null;
          // this.draggableRef.style.top = null;
          // this.draggableRef.style['pointer-events'] = null;
          // this.isDragging = false;
          this.setState(state => ({ isDragging: false }))
        };
        document.addEventListener('mouseup', mouseup);
      };
      this.draggableRef.addEventListener('mousedown', mousedown);
    }
  }

  render() {
    const { classes } = this.props;
    const { fields, addedFieldIds, isDragging } = this.state;
    return (
      <div>
        <Grid container>
          <Grid item xs={8}>
            <div ref={this.setFielContainerRef}>
              {fields.map((field, i) => (
                // <TextField
                //   key={field.id}
                //   className={classes.field}
                //   fullWidth
                //   multiline
                //   placeholder={`${field.id} Add some content`}
                // />
                <Paper
                  key={field.id}
                  className={`${classes.paper} ${addedFieldIds.includes(field.id) ? 'flash-button' : ''}`}>
                  {field.text}
                </Paper>
              ))}
            </div>
          </Grid>
        </Grid>
        {ReactDOM.createPortal(
          <div className={classes.controls}>
            <div className={classes.draggable} ref={this.setDraggableRef}>
              <ModeComment />
            </div>
          </div>,
          this.el
        )}
        {isDragging &&
          ReactDOM.createPortal(
            <NewPaper />,
            this.draggingEl
          )}
      </div>
    );
  }
}

export default withStyles(styles)(ContentCreator);