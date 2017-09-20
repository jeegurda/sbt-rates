export default class HoverNote extends React.PureComponent {
  render() {
    return (
      <span className="tip" title={ this.props.text } />
    );
  }
}
