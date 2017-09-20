import { connect } from 'react-redux';
import * as actions from '../../actions/';

import AsideFilterConverterResult from '../aside/ratesAsideFilterConverterResult';
import AsideFilterConverterInput from '../aside/ratesAsideFilterConverterInput';
import AsideFilterConverterDate from '../aside/ratesAsideFilterConverterDate';
import AsideFilterConverterParams from '../aside/ratesAsideFilterConverterParams';
import converterConfig from '../../converterConfig';

class AsideFilterConverter extends React.Component {
  componentDidUpdate() {
  /*  Rates.DOM.converterAmount = this.refs.converterAmount;
    Aside.initSelect(this.refs.converterFrom);
    Aside.initSelect(this.refs.converterTo);
    Rates.initDatepicker(this.refs.converterDatepicker);*/
  }
  render() {
    let { dict, updateConverter } = this.props;

    return (
      <div>
        <div className="rates-aside-filter rates-container">
          <AsideFilterConverterInput />
          { converterConfig.params.map(param =>
            <AsideFilterConverterParams param={ param } key={ param.name } />
          ) }
          <AsideFilterConverterDate />
          <div className="filter-block">
            <button className="button" onClick={ updateConverter }>{ dict.show }</button>
          </div>
        </div>
        <AsideFilterConverterResult />
      </div>
    );
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
  }),
  dispatch => ({
    updateConverter: e => dispatch(actions.updateConverter(e)),
  })
)(AsideFilterConverter);
