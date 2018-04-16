import React, { Component, createContext } from 'react';
import site from 'next-docify/site';
import {
  mediaQueryContext,
  mediaQueryList,
  resolveMatches,
  defaultMatches,
} from '../context/mediaQueryContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

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
    site({
      accessPath: '/docs',
      path: '/docs/android-sdk/gai-shu/gai-shu',
    }).then(data => {
      const { dataSource, manifest, postmeta } = data;
      const { content } = dataSource;
      this.setState({
        content,
        manifest,
        postmeta,
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
          <Header toggleNav={this.toggleNav.bind(this)} />
          <Sidebar
            toggleNav={this.toggleNav.bind(this)}
            showNav={this.state.showNav}
            manifest={this.state.manifest}
            postmeta={this.state.postmeta}
          />
        </section>
      </mediaQueryContext.Provider>
    );
  }
}

// import React from 'react';
// import site from 'next-docify/site';

// export default class App extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       content: '',
//     };
//   }
//   componentDidMount() {
//     site({
//       path: '/docs/tutorial/quick-start',
//     }).then(data => {
//       const { dataSource } = data;
//       const { content } = dataSource;
//       this.setState({
//         content,
//       });
//     });
//   }

//   render() {
//     const { content } = this.state;
//     return (
//       <div
//         dangerouslySetInnerHTML={{
//           __html: content,
//         }}
//       />
//     );
//   }
// }
