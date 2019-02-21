import initialState from './inititalState';
import { ACTION } from './actions';
import { getDropControls, getDragControls, getDeleteControls } from './control.functions';

export default (state = initialState, action) => {
  // console.log(action);
  switch (action.type) {
    case ACTION.CHANGE_TAB: {
      return { ...state, tabIndex: action.tabIndex };
    }
    case ACTION.DELETE_CONTROL: {
      const controls = getDeleteControls(state, action.id);
      return { ...state, controls };
    }
    case ACTION.CHANGE_TEXT_CONTROL: {
      const controls = { ...state.controls };
      controls[action.id] = { ...controls[action.id], text: action.text };
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