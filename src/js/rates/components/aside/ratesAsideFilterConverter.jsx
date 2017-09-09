
import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';

import AsideFilterConverterResult from '../aside/ratesAsideFilterConverterResult';
import converterConfig from '../../converterConfig';

// TODO: should be external, doesn't work in standalone!
class HoverNote extends React.Component {
    render() {
        return null;
    }
}

class AsideFilterConverter extends React.Component {
    componentDidUpdate() {
    /*  Rates.DOM.converterAmount = this.refs.converterAmount;
        Aside.initSelect(this.refs.converterFrom);
        Aside.initSelect(this.refs.converterTo);
        Rates.initDatepicker(this.refs.converterDatepicker);*/
    }
    render() {

        let premiumServiceNote;
        let {
            converter, premiumServiceAllowedCodes, data, dict, destinationCurrency, invalidFields, ui,
            updateConverter, changeAmount, selectCode, changeConverterParams, changeConverterDate
        } = this.props;

        // if there is a currency selected which is not in a premiumServiceAllowedCodes array and is not '' (RUR)
        // for first/premium service types, show a warning
        if (converter.params.servicePack !== 'empty') {
            let wrongCodes = [];

            if (converter.from && !~premiumServiceAllowedCodes.indexOf(converter.from)) {
                wrongCodes.push(data[converter.from].isoName);
            }
            if (converter.to && !~premiumServiceAllowedCodes.indexOf(converter.to)) {
                wrongCodes.push(data[converter.to].isoName);
            }

            if (wrongCodes.length) {
                premiumServiceNote = <span className="rates-aside-error">
                    {`${dict.converterOptionsError}: ${wrongCodes.join(', ')}`}
                </span>;
            }
        }

        return (
            <div>
                <div className="rates-aside-filter rates-container">
                    <div className="filter-block filter-block-converter">
                        <div>
                            <h6>{dict.filterConverter}</h6>
                        </div>
                        <div className="filter-block-line filter-block-line-amount">
                            <div className="filter-block-line-right input">
                                <form onSubmit={ updateConverter }>
                                    <input
                                        maxLength="20"
                                        placeholder={dict.filterConverterAmount}
                                        value={converter.amount}
                                        onKeyDown={ actions.onKeyDownAmount }
                                        onChange={ changeAmount }
                                        ref="converterAmount"
                                    />
                                </form>
                            </div>
                        </div>
                        <div className="filter-block-line">
                            <div className="filter-block-line-left">
                                <span>{dict.filterConverterFrom}</span>
                            </div>
                            <div className="filter-block-line-right">
                                <select
                                    ref="converterFrom"
                                    value={converter.from}
                                    name="converterFrom"
                                    onChange={ selectCode }
                                >
                                    <option key={0} value={''}>{destinationCurrency}</option>
                                    {utils.getCodes(data, '', true).map((code, i) => (
                                        <option key={i + 1} value={code}>{data[code].isoName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="filter-block-line">
                            <div className="filter-block-line-left">
                                <span>{dict.filterConverterTo}</span>
                            </div>
                            <div className="filter-block-line-right">
                                <select
                                    ref="converterTo"
                                    value={converter.to}
                                    name="converterTo"
                                    onChange={ selectCode }
                                >
                                    <option key={0} value={''}>{destinationCurrency}</option>
                                    {utils.getCodes(data, '', true).map((code, i) => (
                                        <option key={i + 1} value={code}>{data[code].isoName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="filter-block">
                        <div>
                            <h6>{dict.filterConverterSource}</h6>
                            <HoverNote text={dict.filterConverterSourceTip}/>
                        </div>
                        {converterConfig.params[0].values.map((el, i) => (
                            <label key={i} className={el.active ? null : 'filter-inactive'}>
                                <input
                                    type="radio"
                                    name="sourceCode"
                                    checked={converter.params.sourceCode === el.prop}
                                    value={el.prop}
                                    onChange={ changeConverterParams }
                                />
                                <span className="radio"/>
                                <p>
                                    {dict[`filterConverterSource${utils.capitalize(el.prop)}`]}
                                </p>
                            </label>
                        ))}
                    </div>
                    <div className="filter-block">
                        <div>
                            <h6>{dict.filterConverterDest}</h6>
                            <HoverNote text={dict.filterConverterDestTip}/>
                        </div>
                        {converterConfig.params[1].values.map((el, i) => (
                            <label key={i} className={el.active ? null : 'filter-inactive'}>
                                <input
                                    type="radio"
                                    name="destinationCode"
                                    checked={converter.params.destinationCode === el.prop}
                                    value={el.prop}
                                    onChange={ changeConverterParams }
                                />
                                <span className="radio"/>
                                <p>
                                    {dict[`filterConverterDest${utils.capitalize(el.prop)}`]}
                                </p>
                            </label>
                        ))}
                    </div>
                    <div className="filter-block">
                        <div>
                            <h6>{dict.filterConverterExchange}</h6>
                            <HoverNote text={dict.filterConverterExchangeTip}/>
                        </div>
                        {converterConfig.params[2].values.map((el, i) => (
                            <label key={i} className={el.active ? null : 'filter-inactive'}>
                                <input
                                    type="radio"
                                    name="exchangeType"
                                    checked={converter.params.exchangeType === el.prop}
                                    value={el.prop}
                                    onChange={ changeConverterParams }
                                />
                                <span className="radio"/>
                                <p>
                                    {dict[`filterConverterExchange${utils.capitalize(el.prop)}`]}
                                </p>
                            </label>
                        ))}
                    </div>
                    <div className="filter-block">
                        <div>
                            <h6>{dict.filterConverterService}</h6>
                            <HoverNote text={dict.filterConverterServiceTip}/>
                        </div>
                        {converterConfig.params[3].values.map((el, i) => (
                            <label key={i} className={el.active ? null : 'filter-inactive'}>
                                <input
                                    type="radio"
                                    name="servicePack"
                                    checked={converter.params.servicePack === el.prop}
                                    value={el.prop}
                                    onChange={ changeConverterParams }
                                />
                                <span className="radio"/>
                                <p>
                                    {dict[`filterConverterService${utils.capitalize(el.prop)}`]}
                                </p>
                            </label>
                        ))}
                        {premiumServiceNote}
                    </div>
                    <div className="filter-block">
                        <div>
                            <h6>{dict.filterConverterDate}</h6>
                            <HoverNote text={dict.filterConverterDateTip}/>
                        </div>
                        {['current', 'select'].map((el, i) => (
                            <label key={i}>
                                <input
                                    type="radio"
                                    name="converterDateSelect"
                                    checked={converter.dateSelect === el}
                                    value={el}
                                    onChange={ changeConverterDate }
                                />
                                <span className="radio"/>
                                <p>
                                    {dict[`filterConverterDate${utils.capitalize(el)}`]}
                                </p>
                            </label>
                        ))}
                        {converter.dateSelect === 'select' &&
                            <div className="filter-datepicker input">
                                <input
                                    className={invalidFields.converterDate && 'invalid' || null}
                                    name="converter-datepicker"
                                    data-property="converterDate"
                                    value={ui.converterDate}
                                    onChange={$.noop}
                                    ref="converterDatepicker"
                                    maxLength="21"
                                />
                                <span className="filter-datepicker-trigger"/>
                            </div>
                        }
                    </div>
                    <div className="filter-block">
                        <button className="button" onClick={ updateConverter }>
                            {dict.show}
                        </button>
                    </div>
                </div>
                <AsideFilterConverterResult/>
            </div>
        )
    }
}


export default connect(
    state => ({
        converter: state.converter,
        premiumServiceAllowedCodes: state.settings.premiumServiceAllowedCodes,
        data: state.data,
        dict: state.settings.dict,
        destinationCurrency: state.settings.destinationCurrency,
        invalidFields: state.invalidFields,
        ui: state.ui,
    }),
    dispatch => ({
        updateConverter: e => dispatch( actions.updateConverter(e) ),
        changeAmount: e => dispatch( actions.changeAmount(e) ),
        selectCode: e => dispatch( actions.selectCode(e) ),
        changeConverterParams: e => dispatch( actions.changeConverterParams(e) ),
        changeConverterDate: e => dispatch( actions.changeConverterDate(e) )
    })
)(AsideFilterConverter);
