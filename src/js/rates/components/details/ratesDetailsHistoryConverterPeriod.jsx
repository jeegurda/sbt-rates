
import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';

class DetailsHistoryConverterPeriod extends React.Component {
    render() {
        let { mode, dict, data, converter, destinationCurrency, invalidFields, ui, changeDate, validateInput, requestDetails } = this.props;

        return (
            mode === 'converter' ?
                <div className="rates-details-period">
                    <div className="rates-details-period-title">
                        {data[converter.from || converter.to].isoName}
                        <em>
                            /
                            {destinationCurrency}
                        </em>
                    </div>
                    <div className="rates-details-period-datepicker">
                        <div className="rates-details-period-datepicker-line">
                            { ['from', 'to'].map((el, i) => {
                                return ([
                                    <p>{dict[`filter${utils.capitalize(el)}`]}</p>,
                                    <div className="filter-datepicker input">
                                        <input
                                            className={invalidFields[`${el}Date`] && 'invalid' || null}
                                            name={`filter-datepicker-details-${el}`}
                                            data-property={`${el}Date`}
                                            value={`${ui[`${el}Date`]}`}
                                            onChange={ changeDate }
                                            onBlur={ validateInput }
                                            ref={`filterDatepickerDetails${utils.capitalize(el)}`}
                                            maxLength="10"
                                        />
                                        <span className="filter-datepicker-trigger"/>
                                    </div>
                                ])
                            }) }
                        </div>
                        <div className="rates-details-period-datepicker-line">
                            <button className="button" onClick={ requestDetails }>
                                {dict.show}
                            </button>
                        </div>
                    </div>
                </div>
            :
                null
        );
    }
}

export default connect(
    state => ({
        dict: state.settings.dict,
        data: state.data,
        converter: state.converter,
        destinationCurrency: state.settings.destinationCurrency,
        invalidFields: state.ui.invalidFields,
        mode: state.settings.mode,
        ui: state.ui
    }),
    dispatch => ({
        changeDate: e => dispatch( actions.changeDate(e) ),
        validateInput: e => dispatch( actions.validateInput(e) ),
        requestDetails: () => dispatch( actions.requestDetails() ),
    })
)(DetailsHistoryConverterPeriod);
