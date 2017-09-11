import { connect } from 'react-redux';

class LoadingError extends React.Component {
  render() {
    let { dict, error } = this.props;

    return (
      error.info ?
        <div>{dict.loadingError}</div> :
        null
    );
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
    error: state.error,
  })
)(LoadingError);
