import React from 'react';
import Head from 'next/head';

import DocBanner from 'components/DocBanner';
import Header from 'components/Header';

class Template extends React.Component {
  render() {
    return (
      <article className="app">
        <Head>
          <title>SDK页面</title>
        </Head>

        <section className="np-header">
          <Header />
        </section>

        <section className='np-doc-banner'>
          <DocBanner />
        </section>

        <style jsx>{`
          .np-header {
            position: absolute;
            left: 0;
            width: 100%;
            height: 70px;
            font-size: 16px;
            z-index: 200;
            right: 0;
            {/* border-bottom: 1px solid transparent; */}
            background: #292c2d;

            display: flex;
            justify-content: center;
          }

          .np-doc-banner {
            width: 100%;
            height: 256px;
          }
        `}
        </style>
      </article>
    )
  }
}

export default Template;
