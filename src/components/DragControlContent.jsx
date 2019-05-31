import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField, IconButton, Paper, withStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { deleteControlAction } from '../redux/actions';
import DragBar from './DragBar/DragBar';
import { cl } from 'utils';

const styles = theme => ({
  child: {
    position: 'absolute',
    cursor: 'pointer',
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    right: 2,
    top: 2
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
  }
});

class DragControlContent extends PureComponent {
  render() {
    const { control, classes, onKeyChange, deleteControl, inputRef, dragBarRef } = this.props;
    return (
      <Paper className={classes.child} style={control}>
        {/* {
          !control.isDragControl &&
          <Fragment>
            <DragBar dragBarRef={dragBarRef} />
            <IconButton className={classes.closeButton} onClick={deleteControl}>
              <Delete />
            </IconButton>
          </Fragment>
        } */}
        <TextField
          inputRef={inputRef}
          onChange={onKeyChange}
          multiline
          className={cl(classes.text, control.isDragControl && 'dragging')}
          disabled={control.isDragControl}
          value={control.text}
          placeholder={control.placeholder}
        />
      </Paper>
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => bindActionCreators({
  deleteControl: deleteControlAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DragControlContent));
