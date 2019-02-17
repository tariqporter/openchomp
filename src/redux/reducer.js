import initialState from './inititalState';
import { ACTION } from './actions';
import { getDropControls, getDragControls } from './control.functions';

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION.DELETE_CONTROL: {
      const controls = state.controls.filter(x => x.id !== action.id);
      return { ...state, controls };
    }
    case ACTION.CHANGE_TEXT_CONTROL: {
      const control = state.controls.find(x => x.id === action.id);
      const controls = state.controls.filter(x => x.id !== action.id);
      controls.push({ ...control, text: action.text });
      return { ...state, controls };
    }
    case ACTION.START_DRAG_CONTROL: {
      const control = state.controls.find(x => x.id === action.id);
      const controls = state.controls.filter(x => x.id !== action.id);
      controls.push({ ...control, isDragging: true });
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
      const controls = state.controls.map(x => ({ ...x, width: action.width - (2 * state.padding) }));
      return { ...state, controls, controlsContainerBounds: { ...state.controlsContainerBounds, left: action.left, top: action.top, width: action.width, height: action.height } };
    }
    default: {
      return state;
    }
  }
};