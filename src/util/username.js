const childProcess = require('child_process');

module.exports = () => {
  let env = process.env;
  env = env.SUDO_USER ||
    env.C9_USER ||
    env.LOGNAME ||
    env.USER ||
    env.LNAME ||
    env.USERNAME;
  if (env) return env;

  if (process.platform === 'darwin' || process.platform === 'linux') {
    return childProcess.execSync('id -un').toString().trim();
  } else if (process.platform === 'win32') {
    return childProcess.execSync('whoami').toString().trim();
  }

  return null;
};
