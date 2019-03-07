import uuidv4 from 'uuid/v4';
import { stateToHTML } from 'draft-js-export-html';
import { EditorState, ContentState } from 'draft-js';

// export const padding = 8;
// export const controlHeight = 136;

export const PADDING = 8;
export const CONTROL_HEIGHT = 136;

export const getRect = () => {
  return {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  };
};

export const getDefaultControl = () => {
  const defaultControl = {
    id: uuidv4(),
    index: -1,
    left: PADDING,
    top: PADDING,
    width: null,
    height: null,
    dropLeft: 0,
    dropTop: 0,
    dropWidth: null,
    dropHeight: null,
    isDragControl: true,
    isDragging: false,
    editorState: EditorState.createWithContent(ContentState.createFromText('Text Block')),
    placeholder: ''
  };
  return defaultControl;
};

const getIndex = (controls, top) => {
  return 0;
};

const getNewTop = (state, controls, control, top) => {
  const { contentContainerBounds } = state;
  const ordered = Object.values(controls).filter(x => x.id !== control.id).sort((a, b) => a.index - b.index);
  let runningTop = contentContainerBounds.top + PADDING;
  ordered.forEach(c => {
    // c.top = runningTop;
    runningTop += c.height + PADDING;
  });
  // control.dropTop = runningTop;
  return { index: ordered.length, top: runningTop };
};

export const getDragControls = (state, action) => {
  const { id, deltaX, deltaY } = action;
  const { contentContainerBounds, controlsContainerBounds } = state;
  const controls = { ...state.controls };
  const control = controls[id];
  const { isDragControl } = control;

  const left = control.left + deltaX;
  const top = control.top + deltaY;

  const insideContentContainerBounds = left < contentContainerBounds.left + contentContainerBounds.width;
  if (insideContentContainerBounds || !isDragControl) {
    const dropWidth = contentContainerBounds.width - (2 * PADDING);
    const dropLeft = contentContainerBounds.left + PADDING;
    const { index, top: dropTop } = getNewTop(state, controls, control, top);
    const dropHeight = CONTROL_HEIGHT;

    controls[id] = { ...controls[id], top, left, dropWidth, dropLeft, dropHeight, index, dropTop };
  } else {
    const dropWidth = controlsContainerBounds.width - (2 * PADDING);
    const dropLeft = controlsContainerBounds.left + PADDING;
    const index = getIndex(controls, top);
    const dropTop = index * (control.height + PADDING) + PADDING + controlsContainerBounds.top;
    const dropHeight = null;

    controls[id] = { ...controls[id], top, left, dropWidth, dropLeft, dropTop, dropHeight };
  }

  return controls;
};

export const getDropControls = (state, action) => {
  const { id } = action;
  const { contentContainerBounds, controlsContainerBounds } = state;
  const controls = { ...state.controls };
  const control = controls[id];
  const { left, top, isDragControl } = control;

  const insideContentContainerBounds = left < contentContainerBounds.left + contentContainerBounds.width;
  if (insideContentContainerBounds || !isDragControl) {
    const width = contentContainerBounds.width - (2 * PADDING);
    const left = contentContainerBounds.left + PADDING;
    // const index = getIndex(controls, top);
    // const newTop = index * (control.height + PADDING) + PADDING + contentContainerBounds.top;
    const { top: newTop } = getNewTop(state, controls, control, top);

    const editorState = isDragControl ? EditorState.createEmpty() : control.editorState;
    const placeholder = isDragControl ? 'Type text here' : control.placeholder;

    controls[id] = { ...controls[id], top: newTop, left, width, isDragging: false, isDragControl: false, editorState, placeholder };

    const dc = getDefaultControl();
    controls[dc.id] = { ...dc, left: controlsContainerBounds.left + PADDING, top: controlsContainerBounds.top + PADDING, width: controlsContainerBounds.width - (2 * PADDING) };
  } else {
    const width = controlsContainerBounds.width - (2 * PADDING);
    const left = controlsContainerBounds.left + PADDING;
    const index = getIndex(controls, top);
    const newTop = index * (control.height + PADDING) + PADDING + controlsContainerBounds.top;

    controls[id] = { ...controls[id], top: newTop, left, width, isDragging: false };
  }

  return controls;
};

// const getIndex = (controls, top) => {
//   const droppedControls = Object.values(controls).filter(x => !x.isDragControl && !x.isDragging);
//   let index = Math.floor(top / controlHeight);
//   if (index < 0) {
//     index = 0;
//   } else if (index > droppedControls.length) {
//     index = droppedControls.length;
//   }
//   return index;
// };

// export const getDragControls = (state, id, deltaX, deltaY) => {
//   let controls = { ...state.controls };
//   const control = controls[id];
//   const top = control.top + deltaY;
//   const left = control.left + deltaX;
//   const dropWidth = state.containerBounds.width - (2 * state.padding)
//   const dropLeft = state.containerBounds.left - state.controlsContainerBounds.left + state.padding;
//   const dropIndex = getIndex(controls, top);
//   const dropTop = dropIndex * (controlHeight + state.padding) + state.padding + state.containerBounds.top - state.controlsContainerBounds.top;

//   if (!control.isDragControl || state.controlsContainerBounds.left + control.left < state.containerBounds.left + state.containerBounds.width) {
//     controls[id] = { ...controls[id], index: dropIndex, top, left, dropLeft, dropTop, dropWidth, dropHeight: controlHeight };
//     const sameIndex = Object.values(controls).some(x => x.index === dropIndex && !x.isDragging);
//     if (sameIndex) {
//       controls = orderControls(controls, dropIndex, state.padding, state.containerBounds.top, state.controlsContainerBounds.top);
//     }
//   } else {
//     const dc = getDefaultControl();
//     controls[id] = { ...controls[id], index: dc.index, top, left, dropLeft: dc.dropLeft, dropTop: dc.dropTop, dropWidth: dc.dropWidth, dropHeight: dc.dropHeight };
//     controls = orderControls(controls, null, state.padding, state.containerBounds.top, state.controlsContainerBounds.top);
//   }
//   return controls;
// };

export const getDeleteControls = () => {

};

export const getPreviewHtml = (controls) => {
  const previewHtml = Object.values(controls)
    .filter(control => !control.isDragControl)
    .sort((a, b) => a.index - b.index)
    .map(control => stateToHTML(control.editorState.getCurrentContent())).join('');
  return previewHtml;
};

export const updateControlWidths = (state, action) => {
  const { width, left, top } = action;
  const controls = { ...state.controls };

  Object.values(controls).forEach(c => {
    controls[c.id] = { ...controls[c.id], left: left + PADDING, top: top + PADDING, width: width - (2 * PADDING) };
  });
  return controls;
};

// const getDropControl = () => {
//   const dropControl = { isDragControl: false, isDragging: false, placeholder: 'Type text here' };
//   return dropControl;
// };

// const orderControls = (controls1, dropIndex, padding, containerTop, controlsContainerTop) => {
//   const controls = { ...controls1 };
//   let newIndex = 0;
//   const controlsArr = Object.values(controls);
//   const changedIds = [];
//   while (newIndex < controlsArr.length) {
//     const ordered = controlsArr.filter(x => !x.isDragControl && !x.isDragging && !changedIds.includes(x.id)).sort((a, b) => a.index - b.index);
//     if (!ordered.length) break;
//     const lowestId = ordered[0].id;
//     if (newIndex === dropIndex) newIndex++;
//     controls[lowestId] = { ...controls[lowestId], index: newIndex, top: newIndex * (controlHeight + padding) + padding + containerTop - controlsContainerTop };
//     changedIds.push(lowestId);
//     newIndex++;
//   }
//   return controls;
// };

// export const getDeleteControls = (state, id) => {
//   let controls = { ...state.controls };
//   delete controls[id];
//   controls = orderControls(controls, null, state.padding, state.containerBounds.top, state.controlsContainerBounds.top);
//   return controls;
// };

// export const getDropControls = (state, id) => {
//   const controls = { ...state.controls };
//   const control = controls[id];
//   const left = state.containerBounds.left - state.controlsContainerBounds.left + state.padding;
//   const index = getIndex(controls, control.top);
//   const top = index * (controlHeight + state.padding) + state.padding + state.containerBounds.top - state.controlsContainerBounds.top;
//   const width = state.containerBounds.width - (2 * state.padding);
//   const dc = getDefaultControl();
//   const editorState = control.isDragControl ? EditorState.createEmpty() : control.editorState;

//   if (!control.isDragControl || state.controlsContainerBounds.left + control.left < state.containerBounds.left + state.containerBounds.width) {
//     controls[id] = { ...controls[id], ...getDropControl(), index, top, left, width, editorState };
//     // Control dropped into container. Create new one
//     if (control.isDragControl) {
//       controls[dc.id] = { ...dc, left: state.padding, top: state.padding, width: state.controlsContainerBounds.width - (state.padding * 2) };
//     }
//   } else {
//     controls[id] = { ...controls[id], index: dc.index, top: dc.top, left: dc.left, editorState: dc.editorState };
//   }
//   return controls;
// };
