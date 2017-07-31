const fs = require('fs');
const babel = require('babel-core');

require.extensions['.jsx'] = function jsx(module, filename) {
  const src = fs.readFileSync(filename);
  const { code } = babel.transform(src, {
    presets: ['es2015', 'stage-0', 'react'],
  });
  return module._compile(code, filename);
};
