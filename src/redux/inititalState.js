import uuidv4 from 'uuid/v4';

const padding = 8;

export default {
  controls: [
    {
      id: uuidv4(),
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
    }
  ],
  containerBounds: {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  },
  controlsContainerBounds: {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  },
  padding
};
