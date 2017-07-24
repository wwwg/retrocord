const map = (number, inMin, inMax, outMin, outMax) => (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

const SHORTHAND_RE = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

module.exports = (hex) => {
  // Expand shorthand form (e.g. '03F') to full form (e.g. "0033FF")
  hex = hex.replace(SHORTHAND_RE, (m, r, g, b) => r + r + g + g + b + b);

  const mapRGB = (x) => Math.round(map(x, 0, 255, 0, 5));

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: mapRGB(parseInt(result[1], 16)),
    g: mapRGB(parseInt(result[2], 16)),
    b: mapRGB(parseInt(result[3], 16))
  } : null;
}
