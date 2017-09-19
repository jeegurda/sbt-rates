import { connect } from 'react-redux';
import * as utils from '../../utils';
import * as domUtils from '../../dom_utils';

class AsideFilterConverterResult extends React.Component {
  componentDidMount() {
    domUtils.registerDOMElements({ 'converterResult': this.converterResult });
  }
  componentWillUnmount() {
    domUtils.unregisterDOMElements('converterResult');
  }
  render() {
    let { dict, converter, data, destinationCurrency } = this.props;

    return (
      <div
        className="converter-result"
        ref={ node => this.converterResult = node }
      >
        { $.isNumeric(converter.result.value) && converter.result.valid ?

          <div className="converter-result-inner">
            <h3>{ dict.filterConverterResult }</h3>
            <h5>
              { utils.format(converter.result.amount) }
              { ' ' }
              { converter.result.from ? data[converter.result.from].isoName : destinationCurrency }
              { ' ' }
              =
            </h5>
            <h4>
              { utils.format(converter.result.value) }
              { ' ' }
              { converter.result.to ? data[converter.result.to].isoName : destinationCurrency }
            </h4>
          </div> :

          null
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
    converter: state.converter,
    data: state.data,
    destinationCurrency: state.settings.destinationCurrency
  })
)(AsideFilterConverterResult);
