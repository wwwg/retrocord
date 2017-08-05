const blessed = require('blessed');

function UserTag(props) {
  const member = props.member;
  const user = member ? member.user : props.user;
  const color = (() => {
    if (member) {
      let hex = member.displayHexColor;
      if (hex === '#000000') hex = '#FFFFFF';
      return hex;
    } else {
      return '#FFFFFF';
    }
  })();

  return blessed.box({
    tags: true,
    style: {
      fg: color,
      bold: props.bold,
    },
    content: user.tag,
  });
}

module.exports = UserTag;
