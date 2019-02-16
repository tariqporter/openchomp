import uuidv4 from 'uuid/v4';

export const controlHeight = 136;

const getDefaultControl = () => {
  const defaultControl = { id: uuidv4(), left: 0, top: 0, width: null, zIndex: 1, isDragControl: true, text: 'Text Block', placeholder: '' };
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
