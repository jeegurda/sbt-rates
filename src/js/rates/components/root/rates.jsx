
import '@css/rates/jquery.jqplot.min.css';

import './rates.scss';

import Aside from '../aside/ratesAside';
import Current from '../current/ratesCurrent';
import Tabs from '../tabs/ratesTabs';
import Details from '../details/ratesDetails';
import TableView from '../tableView/ratesTableView';
import Loading from '../loading/loading';
import LoadingError from '../loading/loadingError';


import api from '../../api';
import select from '../../libs/SBR.plugin.Select';
import popup from '../../libs/SBR.plugin.Popup';

import '../../libs/jquery.jqplot.min';
import '../../libs/jqplot.cursor.min';
import '../../libs/jqplot.dateAxisRenderer.min';
import '../../libs/jqplot.enhancedLegendRenderer.min';
import '../../libs/jqplot.highlighter.min';
import '../../libs/jquery-ui-timepicker-addon';

import moment from 'moment';

import { connect } from 'react-redux';
import * as actions from '../../actions/';

class Rates extends React.Component {
    constructor(props) {
        super(props);
        let { dispatch } = this.props;

/*
        this.DOM = {};
        this.plugins = {select, popup};
*/

        dispatch( actions.init(this.props.settings) );

        dispatch( actions.initUI() );
        dispatch( actions.initConverter() );

        dispatch( actions.requestInitial() );

        dispatch( actions.addDOMEvents() );

    }
    initDatepicker(el) {
        var self = this;
        if (!el) {
            return;
        }

        var inputType = el.getAttribute('data-property');
        this.DOM[inputType] = el;
        var $el = $(el);

        var datepickerOpts = {
            changeYear: true,
            yearRange: "2000:2100",
            minDate: moment(this.props.dict.dataAvailabilityDate, this.props.dateFormat).toDate(),
            maxDate: new Date
        };

        if (inputType === 'converterDate') {
            $el.datetimepicker(_.assign(datepickerOpts, {
                controlType: 'select',
                oneLine: true,
                timeFormat: this.props.timeFormat,
                timeText: this.props.dict.filterConverterDate,
                closeText: this.props.dict.filterConverterDateSelect,
                showButtonPanel: false,
                stepMinute: 5,
                onSelect: function(date) {
                    var newState = {
                        period: 'custom'
                    };

                    newState[inputType] = date;
                    self.setState(newState);
                }
            }));
        } else {
            $el.datepicker(_.assign(datepickerOpts, {
                beforeShow: function() {
                    if (inputType === 'fromDate') {
                        $el
                            .datetimepicker('option', 'maxDate', moment(self.state.toDate, self.props.dateFormat).toDate())
                            .datetimepicker('option', 'minDate', moment(self.props.dict.dataAvailabilityDate, self.props.dateFormat).toDate());
                    } else if (inputType === 'toDate') {
                        $el
                            .datetimepicker('option', 'minDate', moment(self.state.fromDate, self.props.dateFormat).toDate())
                            .datetimepicker('option', 'maxDate', new Date);
                    }
                    // detailedDate datepicker should be restricted by the options, no need to check it
                },
                onSelect: function(date) {
                    var newState = {
                        period: 'custom'
                    };

                    newState[inputType] = date;
                    self.setState(newState);
                }
            }));
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
                <Current/>
                <Aside/>
                <Tabs/>
                <Details/>
                <TableView/>
            </div>
        )
    }
}


export default connect(
    state => ({
        dict: state.settings.dict,
    })
)(Rates);