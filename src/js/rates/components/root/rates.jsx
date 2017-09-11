import '@css/rates/jquery.jqplot.min.css';
import './rates.scss';

import '../../libs/jquery.jqplot.min';
import '../../libs/jqplot.cursor.min';
import '../../libs/jqplot.dateAxisRenderer.min';
import '../../libs/jqplot.enhancedLegendRenderer.min';
import '../../libs/jqplot.highlighter.min';
import '../../libs/jquery-ui-timepicker-addon';

import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from '../../actions/';

import Content from '../root/ratesContent';
import Loading from '../loading/loading';
import LoadingError from '../loading/loadingError';

class Rates extends React.Component {
  constructor(props) {
    super(props);
    let { dispatch } = this.props;

    /*

    import select from '../../libs/SBR.plugin.Select';
    import popup from '../../libs/SBR.plugin.Popup';
    this.DOM = {};
    this.plugins = {select, popup};
    */

    dispatch(actions.init(this.props.settings));

    dispatch(actions.initUI());
    dispatch(actions.initConverter());

    dispatch(actions.requestInitial());

    dispatch(actions.addDOMEvents());
  }
  initDatepicker(el) {
    let that = this;
    if (!el) {
      return;
    }

    let inputType = el.getAttribute('data-property');
    this.DOM[inputType] = el;
    let $el = $(el);

    let datepickerOpts = {
      changeYear: true,
      yearRange: '2000:2100',
      minDate: moment(this.props.dict.dataAvailabilityDate, this.props.dateFormat).toDate(),
      maxDate: new Date()
    };

    if (inputType === 'converterDate') {
      $el.datetimepicker({ ...datepickerOpts, ...{
        controlType: 'select',
        oneLine: true,
        timeFormat: this.props.timeFormat,
        timeText: this.props.dict.filterConverterDate,
        closeText: this.props.dict.filterConverterDateSelect,
        showButtonPanel: false,
        stepMinute: 5,
        onSelect(date) {
          let newState = {
            period: 'custom'
          };

          newState[inputType] = date;
          that.setState(newState);
        }
      } });
    } else {
      $el.datepicker({ ...datepickerOpts, ...{
        beforeShow() {
          if (inputType === 'fromDate') {
            $el
              .datetimepicker('option', 'maxDate', moment(that.state.toDate, that.props.dateFormat).toDate())
              .datetimepicker('option', 'minDate', moment(that.props.dict.dataAvailabilityDate, that.props.dateFormat).toDate());
          } else if (inputType === 'toDate') {
            $el
              .datetimepicker('option', 'minDate', moment(that.state.fromDate, that.props.dateFormat).toDate())
              .datetimepicker('option', 'maxDate', new Date());
          }
          // detailedDate datepicker should be restricted by the options, no need to check it
        },
        onSelect(date) {
          let newState = {
            period: 'custom'
          };

          newState[inputType] = date;
          that.setState(newState);
        }
      } });
    }
  }
  componentDidMount() {
    /*var self = this;

    $(document.body)
      .on('click', '.filter-datepicker-trigger', function() {
        $(this).prev('input').focus();
      })
      .on('click', '.converter-datepicker-hide', function() {
        $(self.DOM.converterDate).datepicker('hide');
      });*/

  }
  render() {
    return (
      <div className="widget-rates">
        <LoadingError/>
        <Loading/>
        <Content/>
      </div>
    );
  }
}

export default connect()(Rates);
