
import { connect } from 'react-redux';
import * as actions from '../../actions/';
import * as utils from '../../utils';

class DetailsHistoryRangeSelect extends React.Component {
    render() {

        let { dict, item, code, toggleRangePopup, changeRange } = this.props;

        return (
            // ranges should be there, but if it's the only one, don't display it
            item.ranges.length > 1 ?
                <div className="rl-right">
                    <span onClick={ toggleRangePopup.bind(null, true, code) }>
                        {dict.detailsSelectRange}
                    </span>
                    <div className={`rates-container rl-range${item.rangePopupVisible ? ' visible' : ''}`}>
                        <p>{dict.detailsSelectRange}</p>
                        <p>
                            { utils.getRangesDescription(item.ranges, dict).map((el, j) => (
                                <span
                                    onClick={ changeRange.bind(null, code, item.ranges[j].amountFrom) }
                                    className={ item.ranges[j].checked ? 'checked' : '' }
                                    key={j}
                                >
                                    {el}
                                </span>
                            )) }
                        </p>
                    </div>
                </div>
            :
                null
        )
    }
}

export default connect(
    state => ({
        dict: state.settings.dict,
        // data isn't used here but is needed to watch for changes
        data: state.data,
    }),
    dispatch => ({
        toggleRangePopup: (open, code) => dispatch( actions.toggleRangePopup(open, code) ),
        changeRange: (code, from) => dispatch( actions.changeRange(code, from) ),
    })
)(DetailsHistoryRangeSelect);
