import * as utils from '../../utils';
import { connect } from 'react-redux';

class CurrentNote extends React.Component {
  render() {
    let note;
    let { dict, ratesType, language, mode } = this.props;

    if (ratesType === 'first' || ratesType === 'premium') {
      let noteText = dict[`currentNoteFragment${mode === 'metal' ? 'Metal' : 'Currency'}`];
      let noteLinkUrl = dict[`${ratesType}Link${utils.capitalize(language)}`];
      let noteLinkText = dict.currentNoteFragmentLink.format(dict[`currentNote${utils.capitalize(ratesType)}`]);
      let noteLink = '<a href="{0}" target="_blank">{1}</a>'.format(noteLinkUrl, noteLinkText);

      note =
        <div className="current-rates-note rates-note">
          <strong>{ dict.currentNoteBold }</strong>
          <span>{ ' ' }</span>
          { /* eslint-disable react/no-danger */ }
          <span dangerouslySetInnerHTML={ { __html: noteText.format(noteLink) } } />
          { /* eslint-enable react/no-danger */ }
        </div>;
    } else {
      note = null;
    }

    return note;
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
    ratesType: state.settings.ratesType,
    language: state.settings.language
  })
)(CurrentNote);
