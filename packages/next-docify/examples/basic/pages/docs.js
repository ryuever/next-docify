import React from 'react';
import site from 'next-docify/site';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
    };
  }
  componentDidMount() {
    site({
      accessPath: '/docs',
      path: '/docs/tutorial/quick-start',
    }).then(data => {
      console.log('data : ', data);
    });
  }

  render() {
    return null;
  }
}
