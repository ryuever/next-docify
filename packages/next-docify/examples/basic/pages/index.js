import React from 'react';
import { DOCIFY_CHUNK_PREFIX } from '../../../lib/webpack/constants';

const getComponent = () => {
  const bundle = require.context('../docs', true, /\.md$/);
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };
  }

  handleClick() {
    this.setState({
      count: this.state.count + 1,
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick.bind(this)}>counter</button>
        <div>{this.state.count}</div>
      </div>
    );
  }
}

export default App;
