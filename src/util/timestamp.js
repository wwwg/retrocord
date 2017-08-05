const lp = require('./lp');

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

module.exports = timestamp;
