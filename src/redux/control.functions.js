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
  const droppedControls = controls.filter(x => !x.isDragControl);
  let index = Math.floor(top / controlHeight);
  if (index < 0) {
    index = 0;
  }
  //  else if (index > droppedControls.length) {
  //   index = droppedControls.length;
  // }
  return index;
};

const getDropControl = () => {
  const dropControl = { isDragControl: false, isDragging: false, placeholder: 'Type text here' };
  return dropControl;
};

export const getDeleteControls = (state, id) => {
  const controls = state.controls.filter(x => x.id !== id);
  let newIndex = 0;
  controls.forEach(control1 => {
    if (!control1.isDragControl) {
      control1.index = newIndex;
      control1.top = newIndex * (controlHeight + state.padding) + state.padding;
      newIndex++;
    }
  });
  return controls;
};

export const getDropControls = (state, id) => {
  const control = state.controls.find(x => x.id === id);
  const controls = state.controls.filter(x => x.id !== id);
  const left = state.containerBounds.left - state.controlsContainerBounds.left + state.padding;
  const index = getIndex(controls, control.top);
  const top = index * (controlHeight + state.padding) + state.padding;
  const width = state.containerBounds.width - (2 * state.padding);
  const text = control.isDragControl ? '' : control.text;
  controls.splice(index, 0, { ...control, ...getDropControl(), index, left, top, width, text });
  if (control.isDragControl) {
    controls.push({ ...getDefaultControl(), left: state.padding, top: state.padding, width: state.controlsContainerBounds.width - (state.padding * 2) });
  }
  return controls;
};

export const getDragControls = (state, id, deltaX, deltaY) => {
  const control = state.controls.find(x => x.id === id);
  // console.log(state, control)
  const controls = state.controls.filter(x => x.id !== id);
  const top = control.top + deltaY;
  const dropWidth = state.containerBounds.width - (2 * state.padding)
  const dropLeft = state.containerBounds.left - state.controlsContainerBounds.left + state.padding;
  const dropIndex = getIndex(controls, top);
  const dropTop = dropIndex * (controlHeight + state.padding) + state.padding;
  const sameIndex = controls.some(x => x.index === dropIndex && !x.isDragging);
  if (sameIndex) {
    let newIndex = 0;
    controls.forEach((c, i) => {
      if (newIndex === dropIndex) newIndex++;
      if (!controls[i].isDragControl) {
        controls[i].index = newIndex;
        controls[i].top =  newIndex * (controlHeight + state.padding) + state.padding;
        newIndex++;
      }
    });
  }
  controls.splice(dropIndex, 0, { ...control, index: dropIndex, top, left: control.left + deltaX, dropLeft, dropTop, dropWidth, dropHeight: controlHeight });
  return controls;
};
