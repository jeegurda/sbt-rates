
import * as utils from '../../utils';
import { connect } from 'react-redux';

class CurrentLinks extends React.Component {
    render() {
        let links;
        let { mode, dict, language } = this.props;

        if (mode === 'metal') {
            links = (
                <div className="current-links">
                    <a href={dict['calculatorIncomeLink' + utils.capitalize(language)]}>
                        {dict.calculatorIncome}
                    </a>
                </div>
            )
        } else if (mode === 'currency') {
            links = (
                <div className="current-links">
                    <a href={dict['calculatorLink' + utils.capitalize(language)]}>
                        {dict.calculator}
                    </a>
                </div>
            )
        } else {
            links = null;
        }

        return links;
    }
}

export default connect(
    state => ({
        dict: state.settings.dict,
        mode: state.settings.mode,
        language: state.settings.language
    })
)(CurrentLinks);
