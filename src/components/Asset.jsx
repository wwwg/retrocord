const React = require('react');
const PropTypes = require('prop-types');

const assets = require('../lib/assets');

class Asset extends React.Component {
  render() {
    let prefix = '';
    let suffix = '';
    if (this.props.style.center) {
      prefix = '{center}';
      suffix = '{/center}';
    }
    return (
      <box tags={true}
        style={this.props.style}
        top={this.props.style.vcenter ? 'center' : undefined}>
        {`${prefix}${assets[this.props.asset]}${suffix}`}
      </box>
    );
  }

  getDefaultProps() {
    return {
      style: {},
    };
  }
}

Asset.propTypes = {
  style: PropTypes.object,
  asset: PropTypes.string.isRequired,
};

module.exports = Asset;
