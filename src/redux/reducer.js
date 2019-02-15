import initialState from './inititalState';
import { ACTION } from './actions';

const getDefaultControl = () => {
  const defaultControl = { id: Math.round(Math.random() * 1000), left: 0, top: 0, width: null, zIndex: 1, isDragControl: true, text: 'Text Block', placeholder: '' };
  return defaultControl;
};

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
    case ACTION.DRAG_CONTROL: {
      const control = state.controls.find(x => x.id === action.id);
      const controls = state.controls.filter(x => x.id !== action.id);
      controls.push({ ...control, top: control.top + action.deltaY, left: control.left + action.deltaX });
      return { ...state, controls };
    }
    case ACTION.DROP_CONTROL: {
      const control = state.controls.find(x => x.id === action.id);
      const controls = state.controls.filter(x => x.id !== action.id);
      controls.push({ ...control, isDragControl: false, left: state.containerBounds.left - state.controlsContainerBounds.left, width: state.containerBounds.width, text: '', placeholder: 'Type text here' });
      controls.push(getDefaultControl());
      return { ...state, controls };
    }
    case ACTION.SET_CONTAINER_BOUNDS: {
      return { ...state, containerBounds: { ...state.containerBounds, left: action.left, top: action.top, width: action.width, height: action.height } };
    }
    case ACTION.SET_CONTROLS_CONTAINER_BOUNDS: {
      return { ...state, controlsContainerBounds: { ...state.controlsContainerBounds, left: action.left, top: action.top, width: action.width, height: action.height } };
    }
    default: {
      return state;
    }
  }
};