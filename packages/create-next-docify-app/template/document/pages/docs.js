import React, { Component, createContext } from 'react';
import site from 'next-docify/site';
import Head from 'next/head';
import {
  mediaQueryContext,
  mediaQueryList,
  resolveMatches,
  defaultMatches,
} from '../context/mediaQueryContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import parseQuery from '../utils/parseQuery';

export default class IndexPage extends Component {
  constructor(props) {
    super(props);
    let queryMatches = defaultMatches;

    if (process.browser) {
      queryMatches = resolveMatches();
    }

    this.state = {
      queryMatches,
      showNav: false,
      content: '',
      manifest: [],
      accessPath: '',
    };

    this.handleMediaChange = this.handleMediaChange.bind(this);
  }

  handleMediaChange(mql) {
    this.setState({
      queryMatches: resolveMatches(),
    });
  }

  toggleNav() {
    this.setState({
      showNav: !this.state.showNav,
    });
  }

  componentDidMount() {
    mediaQueryList.forEach(queryList =>
      queryList.query.addListener(this.handleMediaChange)
    );
    mediaQueryList.forEach(queryList =>
      this.handleMediaChange(queryList.query)
    );

    const path = parseQuery(window.location.search).title;
    const accessPath = window.location.pathname
      .replace(/\/index\.html$/, '')
      .replace(/\/$/, '');

    site({
      accessPath,
      path,
    }).then(data => {
      const { dataSource, manifest, postmeta } = data;
      const { content } = dataSource;
      this.setState({
        content,
        manifest,
        postmeta,
        accessPath,
      });
    });
  }

  componentWillUnmount() {
    mediaQueryList.forEach(queryList =>
      queryList.query.removeListener(this.handleMediaChange.bind)
    );
  }

  renderContent() {
    const { content } = this.state;
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    );
  }

  render() {
    const mediaValues = {
      mediaQueryList,
      queryMatches: this.state.queryMatches,
    };
    return (
      <mediaQueryContext.Provider value={mediaValues}>
        <section>
          <Head>
            <link
              rel="stylesheet"
              href="/static/stylesheets/highlight/monokai.css"
            />
          </Head>

          <Header toggleNav={this.toggleNav.bind(this)} />
          <Sidebar
            toggleNav={this.toggleNav.bind(this)}
            showNav={this.state.showNav}
            manifest={this.state.manifest}
            postmeta={this.state.postmeta}
            accessPath={this.state.accessPath}
          />
          <section className="main-content">
            {this.renderContent()}

            <style jsx>
              {`
                .main-content {
                  padding: 24px 16px;
                  max-width: 750px;
                  margin-left: auto;
                  margin-right: auto;
                }
              `}
            </style>
          </section>
        </section>
      </mediaQueryContext.Provider>
    );
  }
}
