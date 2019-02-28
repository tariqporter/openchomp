import { getDefaultControl, getRect } from './control.functions';

const defaultControl = getDefaultControl();

export default {
  controls: {
    [defaultControl.id]: defaultControl
  },
  contentContainerBounds: getRect(),
  controlsContainerBounds: getRect(),
  previewHtml: '',
  tabIndex: 0
};
