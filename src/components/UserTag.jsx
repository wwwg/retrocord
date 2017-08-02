const React = require('react');
const PropTypes = require('prop-types');

class UserTag extends React.Component {
  render() {
    const member = this.props.member;
    const user = member ? member.user : this.props.user;
    const color = (() => {
      if (member) {
        let hex = member.displayHexColor;
        if (hex === '#000000') hex = '#FFFFFF';
        return hex;
      } else {
        return '#FFFFFF';
      }
    })();
    return <box tags={true} style={{ fg: color, bold: this.props.bold }}>{user.tag}</box>;
  }
}

UserTag.propTypes = {
  user: PropTypes.object,
  member: PropTypes.object,
  bold: PropTypes.bool,
};

module.exports = UserTag;
