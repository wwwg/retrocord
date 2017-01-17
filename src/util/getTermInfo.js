const path = require('path');
const cp = require('child_process');

const ANSI_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;

function properPath(program) {
  return path.resolve(path.join(__dirname, `../vendor/${program}/${process.platform}`));
}

function getTerm() {
  let neofetch;
  let screenfetch;
  let final;
  try {
    neofetch = cp.execSync(properPath('neofetch')).toString().trim();
    screenfetch = cp.execSync(properPath('screenfetch')).toString().trim();
    final = `${neofetch}\n${screenfetch}`.replace(ANSI_REGEX, '');
  } catch (err) {
    return {};
  }

  function fetch(prop, which = final) {
    const regex = new RegExp(`${prop}: (.+[\\n\\r])`, 'gi');
    const match = regex.exec(which);
    if (match) return match[1].trim();
    return '';
  }

  return {
    font: fetch('Font'),
    shell: fetch('Shell'),
    cpu: fetch('CPU'),
    gpu: fetch('GPU'),
    resolution: fetch('Resolution').split('x'),
  };
}

module.exports = getTerm;

if (require.main === module) process.stdout.write(JSON.stringify(getTerm()));
