const blessed = require('blessed');

function UserTag(props) {
  var user;
  if (props.member) {
    user = props.member.user;
  } else {
    user = props.user;
  }
  const color = (() => {
    if (props.member) {
      let hex = props.member.displayHexColor;
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
