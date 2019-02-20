import uuidv4 from 'uuid/v4';

export const padding = 8;
export const controlHeight = 136;

export const getDefaultControl = () => {
  const defaultControl = {
    id: uuidv4(),
    index: -1,
    left: padding,
    top: padding,
    width: null,
    dropLeft: 0,
    dropTop: 0,
    dropWidth: null,
    isDragControl: true,
    isDragging: false,
    text: 'Text Block',
    placeholder: ''
  };
  return defaultControl;
};

const getIndex = (controls, top) => {
  const droppedControls = Object.values(controls).filter(x => !x.isDragControl && !x.isDragging);
  let index = Math.floor(top / controlHeight);
  if (index < 0) {
    index = 0;
  } else if (index > droppedControls.length) {
    index = droppedControls.length;
  }
  return index;
};

const getDropControl = () => {
  const dropControl = { isDragControl: false, isDragging: false, placeholder: 'Type text here' };
  return dropControl;
};

export const getDeleteControls = (state, id) => {
  const controls = { ...state.controls };
  delete controls[id];

  let newIndex = 0;
  const controlsArr = Object.values(controls);
  const changedIds = [];
  while (newIndex < controlsArr.length) {
    const ordered = controlsArr.filter(x => !x.isDragControl && !x.isDragging && !changedIds.includes(x.id)).sort((a, b) => a.index - b.index);
    if (!ordered.length) break;
    const lowestId = ordered[0].id;
    controls[lowestId] = { ...controls[lowestId], index: newIndex, top: newIndex * (controlHeight + padding) + padding };
    changedIds.push(lowestId);
    newIndex++;
  }
  return controls;
};

export const getDropControls = (state, id) => {
  const controls = { ...state.controls };
  const control = controls[id];
  const left = state.containerBounds.left - state.controlsContainerBounds.left + state.padding;
  const index = getIndex(controls, control.top);
  const top = index * (controlHeight + state.padding) + state.padding;
  const width = state.containerBounds.width - (2 * state.padding);
  const text = control.isDragControl ? '' : control.text;
  controls[id] = { ...controls[id], ...getDropControl(), index, left, top, width, text };
  if (control.isDragControl) {
    const defaultControl = getDefaultControl()
    controls[defaultControl.id] = { ...defaultControl, left: state.padding, top: state.padding, width: state.controlsContainerBounds.width - (state.padding * 2) };
  }
  return controls;
};

const reorderControls = (controls, dropIndex, padding) => {
  let newIndex = 0;
  const controlsArr = Object.values(controls);
  const sameIndex = controlsArr.some(x => x.index === dropIndex && !x.isDragging);
  const changedIds = [];
  if (sameIndex) {
    while (newIndex < controlsArr.length) {
      const ordered = controlsArr.filter(x => !x.isDragControl && !x.isDragging && !changedIds.includes(x.id)).sort((a, b) => a.index - b.index);
      if (!ordered.length) break;
      const lowestId = ordered[0].id;
      if (newIndex === dropIndex) newIndex++;
      controls[lowestId] = { ...controls[lowestId], index: newIndex, top: newIndex * (controlHeight + padding) + padding };
      changedIds.push(lowestId);
      newIndex++;
    }
  }
};

export const getDragControls = (state, id, deltaX, deltaY) => {
  const controls = { ...state.controls };
  const control = controls[id];
  const top = control.top + deltaY;
  const dropWidth = state.containerBounds.width - (2 * state.padding)
  const dropLeft = state.containerBounds.left - state.controlsContainerBounds.left + state.padding;
  const dropIndex = getIndex(controls, top);
  const dropTop = dropIndex * (controlHeight + state.padding) + state.padding;
  controls[id] = { ...controls[id], index: dropIndex, top, left: control.left + deltaX, dropLeft, dropTop, dropWidth, dropHeight: controlHeight };
  reorderControls(controls, dropIndex, state.padding);
  return controls;
};
