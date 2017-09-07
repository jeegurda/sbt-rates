
import { connect }  from 'react-redux';

class LoadingError extends React.Component {
    render() {
        let error = this.props.error.info;

        return (
            error ?
                <div>{this.props.dict.loadingError}</div>
            :
                null
        )
    }
}

export default connect(
    state => ({
        error: state.error,
        dict: state.settings.dict
    })
)(LoadingError);
