import uuidv4 from 'uuid/v4';
import initialState from './inititalState';
import { ACTION } from './actions';

const getDefaultControl = () => {
  const defaultControl = { id: uuidv4(), left: 0, top: 0, width: null, zIndex: 1, isDragControl: true, text: 'Text Block', placeholder: '' };
  return defaultControl;
};

const controlHeight = 136;

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
      const control = state.controls.find(x => x.id === action.id);
      const controls = state.controls.filter(x => x.id !== action.id);
      const top = control.top + action.deltaY;
      const dropWidth = state.containerBounds.width - (2 * state.padding)
      const dropLeft = state.containerBounds.left - state.controlsContainerBounds.left + state.padding;
      const dropIndex = Math.floor(top / controlHeight);
      const dropTop = dropIndex >= 0 ? dropIndex * (controlHeight + state.padding) + state.padding : state.padding;
      controls.push({ ...control, top, left: control.left + action.deltaX, dropLeft, dropTop, dropWidth, dropHeight: controlHeight });
      return { ...state, controls };
    }
    case ACTION.DROP_CONTROL: {
      const control = state.controls.find(x => x.id === action.id);
      const controls = state.controls.filter(x => x.id !== action.id);
      const left = state.containerBounds.left - state.controlsContainerBounds.left + state.padding;
      const index = Math.floor(control.top / controlHeight);
      const top = index >= 0 ? index * (controlHeight + state.padding) + state.padding : state.padding;
      const width = state.containerBounds.width - (2 * state.padding);
      const text = control.isDragControl ? '' : control.text;
      controls.push({ ...control, isDragControl: false, isDragging: false, left, top, width, text, placeholder: 'Type text here' });
      if (control.isDragControl) {
        controls.push({ ...getDefaultControl(), left: state.padding, top: state.padding, width: state.controlsContainerBounds.width - (state.padding * 2) });
      }
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