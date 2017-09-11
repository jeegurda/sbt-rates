import * as actions from './';
import * as utils from '../utils';

export let loading = state => {
  return {
    type: 'LOADING',
    payload: state
  };
};

export let loaded = state => {
  return {
    type: 'LOADED',
    payload: state
  };
};

export let tableView = code => {
  return {
    type: 'SET_TABLE_VIEW',
    payload: code
  };
};

export let changeViewMode = mode => (dispatch, getState) => {
  let state = getState();

  if (mode !== state.viewMode) {
    dispatch({
      type: 'SET_VIEWMODE',
      payload: mode
    });

    dispatch(actions.requestDetails());
  }
};

export let print = id => dispatch => {
  dispatch({
    type: 'PRINT_SECTION',
    payload: id
  });

  $(`#plot-${id}`).find('.jqplot-table-legend-swatch-outline div').each(function() {
    let width = this.clientWidth;
    let height = this.clientHeight;
    let fill = this.style.backgroundColor;
    $(this)
      .hide()
      .after('<svg width="{0}" height="{1}"><rect width="{2}" height="{3}" fill="{4}"/></svg>'.format(
        width, height, width, height, fill
      ));
  });

  $(document.body).addClass('print-rates');

  // have to be made async due to plot rendering lags on slow machines
  setTimeout(() => {
    window.print();
    $(document.body).removeClass('print-rates');

    dispatch({
      type: 'PRINT_SECTION',
      payload: null
    });
  });
};

export let toggleRangePopup = (open, code) => (dispatch, getState) => {
  let state = getState();
  let newStateData = { ...state.data };
  Object.keys(newStateData).forEach(c => newStateData[c].rangePopupVisible = open ? code === c : false);

  dispatch({
    type: 'DATA',
    payload: newStateData
  });
};

export let changeRange = (code, from) => (dispatch, getState) => {
  let state = getState();
  let newStateData = { ...state.data };
  newStateData[code].ranges.forEach(r => r.checked = r.amountFrom === from);

  dispatch({
    type: 'DATA',
    payload: newStateData
  });

  dispatch(actions.toggleRangePopup(false));
  dispatch(actions.drawPlot(code));
};


export let addDOMEvents = () => (dispatch, getState) => {
  let dontClose = false;
  let state = getState();

  $(document).on('click', '.rl-range', () => {
    dontClose = true;
  });

  $(document).on('click', e => {
    if (e.target.tagName.toLowerCase() !== 'input') {
      if (!dontClose && utils.getCodes(state.data, 'rangePopupVisible').length) {
        dispatch(actions.toggleRangePopup(false));
      }
      dontClose = false;
    }
  });
};

export let drawPlot = code => (dispatch, getState) => {
  let state = getState();
  let plots = {};

  dispatch(actions.drawPlotByCodes(code ? [].concat(code) : utils.getCodes(state.data, 'checked'), plots));
};


let resizeTable = (table, tableContainer) => {
  // minus overlay margin from both sides, minus table bottom margin
  let spaceLeft = window.innerHeight - 40 * 2 - table.offsetTop - 40;
  tableContainer.style.maxHeight = `${spaceLeft}px`;
};

export let removeTableViewEvents = () => () => {
  $(window).off('resize.tableView');
};

export let addTableViewEvents = (table, tableContainer) => () => {
  let boundResize = resizeTable.bind(null, table, tableContainer);
  $(window).on('resize.tableView', boundResize);
  boundResize();
};
