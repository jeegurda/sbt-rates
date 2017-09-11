import * as actions from './';

export let requestDetails = () => (dispatch, getState) => {
  let state = getState();

  if (state.viewMode === 'history') {
    return dispatch(actions.requestRanges())
      .then(() => dispatch(actions.requestDated()))
      .then(() => dispatch(actions.drawPlot()))
      .catch(err => {
        console.warn(`Rates: failed to get ranges or dated, aborting sequence: ${err}`);
      });
  } else if (state.viewMode === 'table') {
    return dispatch(actions.requestCurrent());
  }
};

export let requestInitial = () => dispatch => {
  dispatch(actions.loading(true));

  return dispatch(actions.requestInfo())
    .catch(() => {
      dispatch({
        type: 'ERROR',
        payload: {
          info: true
        }
      });
      return Promise.reject();
    })
    .then(() => Promise.all([
      dispatch(actions.requestCurrent(true)),
      dispatch(actions.requestDetails())
    ]))
    .then(() => {
      dispatch(actions.loaded(true));
      dispatch(actions.loading(false));
    })
    .catch(() => {
      dispatch(actions.loading(false));
    });
};
