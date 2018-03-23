import React from 'react';
import Head from 'next/head';

import config from 'config';
import toSlug from 'lib/utils/toSlug';
import parseQuery from 'utils/parseQuery';
import normalizeUrlPath from 'utils/normalizeUrlPath';
import Header from 'components/Header';
import Footer from 'components/Footer';
import DocBanner from 'components/DocBanner';
import DocTemplate from 'components/DocTemplate';
import manifest from '../../build/android-sdk/refine';
import postmeta from '../../build/android-sdk/postmeta'

const dataSource = require.context('../../docs/android-sdk', true, /\.md$/);
const { publicPath, highlightStyleName, markdownCssName } = config;

class Doc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      html: '',
    }
  }

  componentDidMount() {
    this.updateDocContainerMinHeight();
    this.updateFooterStyle();
    const search = window.location.search;
    const { title } = parseQuery(search);

    let page = '';
    dataSource.keys().forEach(key => {
      const titleWithCategory = title.replace(/^[^/]*\//, '');
      const slug = toSlug(key, '/');
      if (slug === titleWithCategory) {
        page = key;
      }
    });

    if (!page) {
      const readme = dataSource.keys().filter(key => toSlug(key) === 'readme');
      if (readme.length > 0) {
        page = readme[0];
      } else {
        window.location.href = '/';
      }
    }

    this.watchPathChange(page);
  }

  updateDocContainerMinHeight() {
    const min = `${window.innerHeight - 256 - 92}px`;
    this.doc.style.minHeight = min;
  }

  updateFooterStyle() {
    this.footer.style.position = 'relative';
  }

  watchPathChange(page) {
    const { content } = dataSource(page);
    this.setState({
      html: content
    })
  }

  render() {
    const cssPath = normalizeUrlPath(`./static/stylesheets/highlight/${highlightStyleName}`, publicPath);
    const markdownCss = normalizeUrlPath(`./static/stylesheets/${markdownCssName}`, publicPath);

    return (
      <article className="app">
        <Head>
          <title>SDK页面</title>
          <link rel="stylesheet" href={cssPath} />
          <link rel="stylesheet" href={markdownCss} />
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
            manifest={manifest}
            postmeta={postmeta}
            html={this.state.html}
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
