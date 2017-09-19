import * as utils from '../../utils';
import { connect } from 'react-redux';

class CurrentExchangeNote extends React.Component {
  render() {
    let exchangeNote;
    let { dict, converter, language, limitedExchangeCodes } = this.props;

    if (
      converter.params.sourceCode === 'cash' &&
      converter.params.destinationCode === 'cash' &&
      (
        limitedExchangeCodes.indexOf(converter.from) !== -1 ||
        limitedExchangeCodes.indexOf(converter.to) !== -1
      )
    ) {
      let exchangeNoteLinkUrl = dict[`exchangeNoteLink${utils.capitalize(language)}`];
      let exchangeNoteLinkText = dict.exchangeNoteLinkText;

      let exchangeNoteLink = '<a href="{0}" target="_blank">{1}</a>'
        .format(exchangeNoteLinkUrl, exchangeNoteLinkText);

      exchangeNote =
        <div className="current-rates-note rates-note">
          { /* eslint-disable react/no-danger */ }
          <span dangerouslySetInnerHTML={ { __html: dict.exchangeNote.format(exchangeNoteLink) } } />
          { /* eslint-enable react/no-danger */ }
        </div>;
    } else {
      exchangeNote = null;
    }

    return exchangeNote;
  }
}

export default connect(
  state => ({
    dict: state.settings.dict,
    language: state.settings.language,
    converter: state.converter,
    limitedExchangeCodes: state.settings.limitedExchangeCodes
  })
)(CurrentExchangeNote);
