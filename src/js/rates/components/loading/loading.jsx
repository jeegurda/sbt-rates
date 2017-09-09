
import { connect }  from 'react-redux';

class Loading extends React.Component {
    render() {
        let { loading, dict } = this.props;

        return (
            loading ?
                <div>{dict.loading}</div>
            :
                null
        )
    }
}

export default connect(
    state => ({
        loading: state.loading,
        dict: state.settings.dict
    })
)(Loading);
