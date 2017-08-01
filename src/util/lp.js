function lp(v, n, c = '0') {
  return String(v).length >= n ? `${v}` : (String(c).repeat(n) + v).slice(-n);
}

module.exports = lp;
