import React from 'react';
import Head from 'next/head';

import Header from 'components/Header';
import Footer from 'components/Footer';
import DocBanner from 'components/DocBanner';
import DocTemplate from 'components/DocTemplate';

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

        <section className="np-doc">
          <DocTemplate />
        </section>

        <footer className="footer">
          <Footer />
        </footer>

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

          .np-doc {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            background: #fff;
          }

          .footer {
            width: 100%;
            background: #2A2C36;
            position: fixed;
            bottom: 0;
          }
        `}
        </style>
      </article>
    )
  }
}

export default Template;
