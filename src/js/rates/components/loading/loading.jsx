
import { connect }  from 'react-redux';

class Loading extends React.Component {
    render() {
        let loading = this.props.loading;

        return (
            loading ?
                <div>{this.props.dict.loading}</div>
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
