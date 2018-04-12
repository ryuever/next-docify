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
      const { dataSource } = data;
      this.setState({
        content: dataSource.content,
      });
    });
  }

  render() {
    const { content } = this.state;
    return (
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      </div>
    );
  }
}
