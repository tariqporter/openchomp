import initialState from './initialState';
import { ACTION } from './actions';
import { getDropControls, getDragControls, getDragStartControls, getDeleteControls, getPreviewHtml, updateControlWidths } from './control.functions';

export default (state = initialState, action) => {
  // console.log(state);
  switch (action.type) {
    case ACTION.CHANGE_TAB: {
      const previewHtml = getPreviewHtml(state.controls);
      return { ...state, tabIndex: action.tabIndex, previewHtml };
    }
    case ACTION.DELETE_CONTROL: {
      const controls = getDeleteControls(state, action.id);
      return { ...state, controls };
    }
    case ACTION.CHANGE_TEXT_CONTROL: {
      const controls = { ...state.controls };
      controls[action.id] = { ...controls[action.id], editorState: action.editorState };
      return { ...state, controls };
    }
    case ACTION.START_DRAG_CONTROL: {
      const controls = getDragStartControls(state, action);
      return { ...state, controls };
    }
    case ACTION.DRAG_CONTROL: {
      const controls = getDragControls(state, action);
      return { ...state, controls };
    }
    case ACTION.DROP_CONTROL: {
      const controls = getDropControls(state, action);
      return { ...state, controls };
    }
    case ACTION.SET_CONTROL_BOUNDS: {
      const controls = { ...state.controls };
      controls[action.id] = { ...controls[action.id], height: action.height };
      return { ...state, controls };
    }
    case ACTION.SET_CONTENT_CONTAINER_BOUNDS: {
      return { ...state, contentContainerBounds: { ...state.contentContainerBounds, left: action.left, top: action.top, width: action.width, height: action.height } };
    }
    case ACTION.SET_CONTROLS_CONTAINER_BOUNDS: {
      const controls = updateControlWidths(state, action);
      return { ...state, controls, controlsContainerBounds: { ...state.controlsContainerBounds, left: action.left, top: action.top, width: action.width, height: action.height } };
    }
    default: {
      return state;
    }
  }
};