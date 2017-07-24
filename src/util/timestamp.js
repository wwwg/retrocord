const lp = (v, n, c = '0') => String(v).length >= n ? `${v}` : (String(c).repeat(n) + v).slice(-n);

function timestamp(d = new Date(), mdy = false) {
  return `${mdy ? `${lp(d.getFullYear().toString(), 2)}-${lp((d.getMonth() + 1).toString(), 2)}-${lp(d.getDate().toString(), 2)} ` : ''}
${lp(d.getHours().toString(), 2)}:
${lp(d.getMinutes().toString(), 2)}:
${lp(d.getSeconds().toString(), 2)}
`.replace(/\n/g, '');
}

module.exports = timestamp;
