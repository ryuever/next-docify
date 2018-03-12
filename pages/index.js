import React from 'react';
import Head from 'next/head';
import config from 'config';

import Header from 'components/Header';
import PromotionCarousel from 'components/PromotionCarousel';

const { platformTitle } = config;

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="app">
        <Head>
          <title>{platformTitle}</title>
        </Head>

        <section className="np-header">
          <Header />
        </section>

        <section className="promotion-carousel">
          <PromotionCarousel />
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
            background: rgba(26,35,46,0.01) !important;

            display: flex;
            justify-content: center;
          }

          .promotion-carousel {
            width: 100%;
            height: 705px;
          }
        `}
        </style>
      </article>
    )
  }
}

export default App;
