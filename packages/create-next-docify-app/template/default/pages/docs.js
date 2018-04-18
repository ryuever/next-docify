import React from 'react';
import site from 'next-docify';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
    };
  }
  componentDidMount() {
    site({
      path: '/docs/tutorial/quick-start',
    }).then(data => {
      const { dataSource } = data;
      const { content } = dataSource;
      this.setState({
        content,
      });
    });
  }

  render() {
    const { content } = this.state;
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    );
  }
}
