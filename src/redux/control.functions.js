import uuidv4 from 'uuid/v4';

export const padding = 8;
export const controlHeight = 136;

export const getDefaultControl = () => {
  const defaultControl = {
    id: uuidv4(),
    index: 0,
    left: padding,
    top: padding,
    width: null,
    dropLeft: 0,
    dropTop: 0,
    dropWidth: null,
    zIndex: 1,
    isDragControl: true,
    isDragging: false,
    text: 'Text Block',
    placeholder: ''
  };
  return defaultControl;
};

const getDropControl = () => {
  const dropControl = { isDragControl: false, isDragging: false, placeholder: 'Type text here' };
  return dropControl;
};

export const getDropControls = (state, id) => {
  const control = state.controls.find(x => x.id === id);
  const controls = state.controls.filter(x => x.id !== id);
  const left = state.containerBounds.left - state.controlsContainerBounds.left + state.padding;
  const index = Math.floor(control.top / controlHeight);
  const top = index >= 0 ? index * (controlHeight + state.padding) + state.padding : state.padding;
  const width = state.containerBounds.width - (2 * state.padding);
  const text = control.isDragControl ? '' : control.text;
  controls.push({ ...control, ...getDropControl(), left, top, width, text });
  if (control.isDragControl) {
    controls.push({ ...getDefaultControl(), left: state.padding, top: state.padding, width: state.controlsContainerBounds.width - (state.padding * 2) });
  }
  return controls;
};

export const getDragControls = (state, id, deltaX, deltaY) => {
  const control = state.controls.find(x => x.id === id);
  const controls = state.controls.filter(x => x.id !== id);
  const top = control.top + deltaY;
  const dropWidth = state.containerBounds.width - (2 * state.padding)
  const dropLeft = state.containerBounds.left - state.controlsContainerBounds.left + state.padding;
  const dropIndex = Math.floor(top / controlHeight);
  const dropTop = dropIndex >= 0 ? dropIndex * (controlHeight + state.padding) + state.padding : state.padding;
  controls.push({ ...control, top, left: control.left + deltaX, dropLeft, dropTop, dropWidth, dropHeight: controlHeight });
  return controls;
}