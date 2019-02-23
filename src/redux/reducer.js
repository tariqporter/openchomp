import initialState from './inititalState';
import { ACTION } from './actions';
import { getDropControls, getDragControls, getDeleteControls, getPreviewHtml } from './control.functions';

export default (state = initialState, action) => {
  // console.log(action);
  switch (action.type) {
    case ACTION.CHANGE_TAB: {
      const previewHtml = getPreviewHtml(state.controls);
      return { ...state, tabIndex: action.tabIndex, previewHtml };
    }
    case ACTION.DELETE_CONTROL: {
      const controls = getDeleteControls(state, action.id);
      return { ...state, controls };
    }
    case ACTION.SET_CONTROL_HEIGHT: {
      const controls = { ...state.controls };
      const diff = action.height - controls[action.id].height;
      controls[action.id] = { ...controls[action.id], height: action.height };
      // const totalHeight = Object.values(controls).filter(control => !control.isDragControl).reduce((acc, control) => acc + control.height, 0);
      // console.log(totalHeight);

      Object.values(controls).filter(control => !control.isDragging && control.index > controls[action.id].index).forEach(control => {
        controls[control.id] = { ...controls[control.id], top: controls[control.id].top + diff };
      });
      return { ...state, controls };
    }
    case ACTION.CHANGE_TEXT_CONTROL: {
      const controls = { ...state.controls };
      controls[action.id] = { ...controls[action.id], editorState: action.editorState };
      return { ...state, controls };
    }
    case ACTION.START_DRAG_CONTROL: {
      const controls = { ...state.controls };
      controls[action.id] = { ...controls[action.id], isDragging: true };
      return { ...state, controls };
    }
    case ACTION.DRAG_CONTROL: {
      const controls = getDragControls(state, action.id, action.deltaX, action.deltaY);
      return { ...state, controls };
    }
    case ACTION.DROP_CONTROL: {
      const controls = getDropControls(state, action.id);
      return { ...state, controls };
    }
    case ACTION.SET_CONTAINER_BOUNDS: {
      return { ...state, containerBounds: { ...state.containerBounds, left: action.left, top: action.top, width: action.width, height: action.height } };
    }
    case ACTION.SET_CONTROL_HEIGHT: {
      const controls = { ...state.controls };
      const diff = action.height - controls[action.id].height;
      // console.log(action.height, controls[action.id].height)
      // const control = controls[action.id];
      controls[action.id] = { ...controls[action.id], height: action.height };

      Object.values(controls)
        .filter(c => !c.isDragControl && c.index > controls[action.id].index)
        .forEach(c => {
          controls[c.id] = { ...controls[c.id], top: controls[c.id].top + diff };
        });

      return { ...state, controls };
    }
    case ACTION.SET_CONTROLS_CONTAINER_BOUNDS: {
      const controls = { ...state.controls };
      Object.values(controls).forEach(c => {
        if (c.isDragControl) {
          controls[c.id] = { ...controls[c.id], width: action.width - (2 * state.padding) };
        }
      });
      return { ...state, controls, controlsContainerBounds: { ...state.controlsContainerBounds, left: action.left, top: action.top, width: action.width, height: action.height } };
    }
    default: {
      return state;
    }
  }
};