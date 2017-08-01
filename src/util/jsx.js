const fs = require('fs');
const babel = require('babel-core');

require.extensions['.jsx'] = function jsx(module, filename) {
  const src = fs.readFileSync(filename);
  const { code } = babel.transform(src, {
    presets: ['react'],
  });
  module._compile(code, filename);
  module.exports.__babelCompiled = code;
};
