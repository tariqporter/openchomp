export const ACTION = {
  CHANGE_TEXT_CONTROL: 'CHANGE_TEXT_CONTROL',
  DELETE_CONTROL: 'DELETE_CONTROL',
  START_DRAG_CONTROL: 'START_DRAG_CONTROL',
  DRAG_CONTROL: 'DRAG_CONTROL',
  DROP_CONTROL: 'DROP_CONTROL',
  SET_CONTAINER_BOUNDS: 'SET_CONTAINER_BOUNDS',
  SET_CONTROLS_CONTAINER_BOUNDS: 'SET_CONTROLS_CONTAINER_BOUNDS',
  SET_CONTROL_BOUNDS: 'SET_CONTROL_BOUNDS',
  CHANGE_TAB: 'CHANGE_TAB',
  SET_CONTROL_HEIGHT: 'SET_CONTROL_HEIGHT'
};

export const deleteControlAction = id => ({
  type: ACTION.DELETE_CONTROL,
  id
});

export const startDragControlAction = id => ({
  type: ACTION.START_DRAG_CONTROL,
  id
});

export const dragControlAction = (id, deltaX, deltaY) => ({
  type: ACTION.DRAG_CONTROL,
  id,
  deltaX,
  deltaY
});

export const dropControlAction = (id) => ({
  type: ACTION.DROP_CONTROL,
  id
});

export const changeTextControlAction = (id, editorState) => ({
  type: ACTION.CHANGE_TEXT_CONTROL,
  id,
  editorState
});

export const setContainerBoundsAction = (left, top, width, height) => ({
  type: ACTION.SET_CONTAINER_BOUNDS,
  left,
  top,
  width,
  height
});

export const setControlsContainerBoundsAction = (left, top, width, height) => ({
  type: ACTION.SET_CONTROLS_CONTAINER_BOUNDS,
  left,
  top,
  width,
  height
});

export const setControlHeightAction = (id, height) => ({
  type: ACTION.SET_CONTROL_HEIGHT,
  id,
  height
});

export const changeTabAction = (tabIndex) => ({
  type: ACTION.CHANGE_TAB,
  tabIndex
});
