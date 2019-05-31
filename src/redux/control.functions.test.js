import { store } from './store'
import { startDragControlAction, dragControlAction, dropControlAction, setContentContainerBoundsAction, setControlsContainerBoundsAction } from '../redux/actions'

it('should update indexes and positions of existing and current control when dragging', () => {
  const dispatch = store.dispatch;
  let state = store.getState();
  const id = Object.keys(state.controls)[0];

  dispatch(setContentContainerBoundsAction(100, 100, 1000, 500));
  dispatch(setControlsContainerBoundsAction(1600, 100, 300, 500));
  dispatch(startDragControlAction(id));
  dispatch(dragControlAction(id, -1000, -100));
  dispatch(dropControlAction(id));

  state = store.getState();
  const dragControlId = Object.keys(state.controls).find(id => state.controls[id].isDragControl)
  // const dragControl = state.controls[dragControlId];

  dispatch(startDragControlAction(dragControlId));
  dispatch(dragControlAction(dragControlId, -1000, -100));

  state = store.getState();
  let controls = state.controls;
  expect(controls[id].index).toEqual(1);
  expect(controls[dragControlId].index).toEqual(0);
  // console.log(state.controls);
});