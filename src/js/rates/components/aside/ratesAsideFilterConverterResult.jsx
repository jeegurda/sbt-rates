import { connect } from 'react-redux';
import * as utils from '../../utils';

class AsideFilterConverterResult extends React.Component {
  /*constructor(props) {
    super(props);
    this.resultVisible = false;
    this.resultTransformedOffset = 50; // initial transformed offset
    this.resultOffset = 25; // additional offset for readability
  }*/
  scrollToResult() {
    /*if (this.refs.converterResult && this.props.Rates.state.converterResult.valid) {
      var result = this.refs.converterResult;
      var resultBottom =
        result.getBoundingClientRect().bottom +
        this.resultOffset +
        (this.resultVisible ? 0 : this.resultTransformedOffset);
      var diff = resultBottom - window.innerHeight;

      this.resultVisible = true;

      if (diff > 0) {
        $('html, body').animate({
          scrollTop: $(window).scrollTop() + diff
        }, 200);
      }
    } else {
      this.resultVisible = false;
    }*/
  }
  render() {
    let { dict, converter, data, destinationCurrency } = this.props;

    if ($.isNumeric(converter.result.value) && converter.result.valid) {
      return (
        <div
          className="converter-result"
          ref={ node => this.converterResult = node }
        >
          <h3>{ dict.filterConverterResult }</h3>
          <h5>
            { utils.format(converter.result.amount) }
            { converter.result.from ? data[converter.result.from].isoName : destinationCurrency }
            =
          </h5>
          <h4>
            { utils.format(converter.result.value) }
            { converter.result.to ? data[converter.result.to].isoName : destinationCurrency }
          </h4>
        </div>
      );
    }
    return <div />;
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
