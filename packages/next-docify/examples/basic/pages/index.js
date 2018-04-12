import React from 'react';

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
