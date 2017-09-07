
import DetailsHistory from '../details/ratesDetailsHistory';
import DetailsTable from '../details/ratesDetailsTable';
import { connect } from 'react-redux';
import * as actions from '../../actions/';

class Details extends React.Component {
    render() {
        let details;
        let { viewMode } = this.props;

        if (viewMode === 'history') {
            details = <DetailsHistory/>
        } else if (viewMode === 'table') {
            details = <DetailsTable/>
        }

        return (
            <div className="rates-right">
                {details}
            </div>
        )
    }
}

export default connect(
    state => ({
        viewMode: state.viewMode,

        dict: state.settings.dict,
        language: state.settings.language
    })
)(Details);
