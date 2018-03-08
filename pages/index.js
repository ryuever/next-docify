import React from 'react';
import Head from 'next/head';

import config from '../config';
const { publicPath } = config;

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="app">
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta charSet='utf-8' />
          <link rel="stylesheet" href={`${publicPath}static/antd.min.css`} />
        </Head>

        <section className="main">
        </section>
      </article>
    )
  }
}

export default App;
