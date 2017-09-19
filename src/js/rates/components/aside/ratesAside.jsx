import AsideFilterRates from '../aside/ratesAsideFilterRates';
import AsideFilterConverter from '../aside/ratesAsideFilterConverter';
import AsideFilterTable from '../aside/ratesAsideFilterTable';

import { connect } from 'react-redux';
import * as actions from '../../actions/';

class Aside extends React.Component {
  /*initSelect(el, preCallback) {
    if (!el || el.hasAttribute('data-select-initialized')) {
      return;
    }
    preCallback && preCallback();
    Rates.DOM[el.name] = el;
    Rates.plugins.select.call($(el), {
      popup: Rates.plugins.popup,
      allowClickOnActive: 'visual',
      ctx: Rates
    });
  }
  componentDidUpdate() {
    Rates.initDatepicker(this.refs.filterDatepickerFrom);
    Rates.initDatepicker(this.refs.filterDatepickerTo);
    Rates.initDatepicker(this.refs.filterDatepickerDetailed);
  }*/
  render() {
    let filter;
    let { viewMode, mode } = this.props;

    if (viewMode === 'table') {
      filter = <AsideFilterTable />;
    } else if (viewMode === 'history') {
      if (mode === 'converter') {
        filter = <AsideFilterConverter />;
      } else {
        filter = <AsideFilterRates />;
      }
    }

    return (
      <aside className="rates-aside">{ filter }</aside>
    );
  }
}

export default connect(
  state => ({
    viewMode: state.viewMode,
    mode: state.settings.mode
  })
)(Aside);
