const React = require('react');
const ctx = require('../ctx');

class Input extends React.Component {
  render() {
    return (
      <textbox bottom={0}
        width='100%'
        height={1}
        inputOnFocus={true}
        mouse={false}
        onSubmit={this.onSubmit}></textbox>
    );
  }

  onSubmit(content) {
    if (!content) return;
    ctx.emit('input', content);
  }
}

module.exports = Input;
