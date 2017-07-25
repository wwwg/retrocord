const chalk = require('chalk');

function centerText(text, width) {
  const length = text.split('\n')[0].replace(/[\u200B-\u200D\uFEFF]/g, '').length;
  const offset = (width / 2) - (length / 2);
  return text.split('\n').map((t) => ' '.repeat(offset) + t).join('\n');
}

function format(text, { width, center = false } = {}) {
  const FORMAT_RE = /{(.+?)}(.+?){\/}/g;
  let match;
  while ((match = FORMAT_RE.exec(text)) != null) { // eslint-disable-line eqeqeq
    let [full, open, content] = match;

    const tokens = open.split('+');
    let color = chalk;
    for (const token of tokens) color = color[token];
    content = color(content);

    text = text.replace(full, content);
  }

  if (center) text = centerText(text, width);

  return text;
}

module.exports = format;
