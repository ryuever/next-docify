import React from 'react';
import Head from 'next/head';
import { parse as parseUrl } from 'url';

import Header from '../components/Header';
import Footer from '../components/Footer';
import DocBanner from '../components/DocBanner';
import DocTemplate from '../components/DocTemplate';

const env = process.env.NODE_ENV;

class Doc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manifest: [],
    }
  }

  componentWillMount() {

  }

  updateDocContainerMinHeight() {
    const min = `${window.innerHeight - 256 - 92}px`;
    this.doc.style.minHeight = min;
  }

  updateFooterStyle() {
    this.footer.style.position = 'relative';
  }

  componentDidMount() {
    this.updateDocContainerMinHeight();
    this.updateFooterStyle();

    const location = window.location.href;
    const { query } = parseUrl(location);
    const parts = query.split('&');
    const options = {};

    parts.forEach(part => {
      const [key, value] = part.split('=');
      options[key] = value;
    })

    import('../build/AndroidSDK/manifest.js').then((content) => {
      this.setState({
        manifest: content,
      })
    })
  }

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

        <section
          ref={(ref) => this.doc = ref}
          className="np-doc">
          <DocTemplate
            manifest={this.state.manifest}
          />
        </section>

        <footer
          ref={(ref) => this.footer = ref}
          className="footer">
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

          a:visited {
            text-decoration: none;
          }
        `}
        </style>
      </article>
    )
  }
}

export default Doc;
