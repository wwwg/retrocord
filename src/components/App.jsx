const React = require('react');

const AssetComponent = require('./Asset.jsx');
const ChannelComponent = require('./Channel.jsx');
const InputComponent = require('./Input.jsx');

const ctx = require('../ctx');
const Storage = require('../Storage');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { startup: true };

    ctx.on('login', () => {
      this.setState({ startup: false });
    });
  }

  render() {
    const logo = <AssetComponent asset='logo' style={{ center: true, vcenter: true }} />;
    if (!Storage.has('token')) {
      return Wrapper([
        logo,
        <box tags={true}>{'{bold}Please Login{/bold}'}</box>,
      ]);
    } else if (this.state.startup) {
      return Wrapper([
        logo,
        <box tags={true}>{'{bold}Logging in...{/bold}'}</box>,
      ]);
    } else {
      return Wrapper(<ChannelComponent />);
    }
  }
}

function Wrapper(inside) {
  return (
    <element>
      <box label='retrocord'
        border={{ type: 'line' }}
        width='100%'
        height='100%-1'>
        {inside}
      </box>
      <InputComponent />
    </element>
  );
}

module.exports = App;
