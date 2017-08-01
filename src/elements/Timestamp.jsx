const React = require('react');
const lp = require('../util/lp');

function timestamp(d = new Date(), date = false) {
  if (typeof d === 'boolean') {
    date = d;
    d = new Date();
  }
  const time = `${lp(d.getHours(), 2)}:${lp(d.getMinutes(), 2)}:${lp(d.getSeconds(), 2)}`;
  if (date) {
    return `${lp(d.getFullYear(), 2)}-${lp((d.getMonth() + 1).toString(), 2)}-${lp(d.getDate(), 2)} ${time}`;
  }
  return time;
}

class Timestamp extends React.Component {
  render() {
    const t = this.props.timestamp;
    const date = typeof this.props.mdy !== 'undefined' ? this.props.mdy :
      new Date() - t > 86400000;
    return <box tags={true}>{timestamp(t, date)}</box>;
  }
}

module.exports = Timestamp;
