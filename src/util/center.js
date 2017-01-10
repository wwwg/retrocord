module.exports = (text) => {
  const length = text.split('\n')[0].replace(/[\u200B-\u200D\uFEFF]/g, '').length;
  const offset = (process.stdout.columns / 2) - (length / 2);
  return text.split('\n').map(t => ' '.repeat(offset) + t).join('\n');
};
