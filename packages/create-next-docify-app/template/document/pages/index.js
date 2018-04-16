import React, { Component, createContext } from 'react';
import {
  mediaQueryContext,
  mediaQueryList,
  resolveMatches,
  defaultMatches,
} from '../context/mediaQueryContext';
import Header from '../components/Header';

export default class IndexPage extends Component {
  constructor(props) {
    super(props);
    let queryMatches = defaultMatches;

    if (process.browser) {
      queryMatches = resolveMatches();
    }

    this.state = {
      queryMatches,
    };

    this.handleMediaChange = this.handleMediaChange.bind(this);
  }

  handleMediaChange(mql) {
    this.setState({
      queryMatches: resolveMatches(),
    });
  }

  componentDidMount() {
    mediaQueryList.forEach(queryList =>
      queryList.query.addListener(this.handleMediaChange)
    );
    mediaQueryList.forEach(queryList =>
      this.handleMediaChange(queryList.query)
    );
  }

  componentWillUnmount() {
    mediaQueryList.forEach(queryList =>
      queryList.query.removeListener(this.handleMediaChange.bind)
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
          <Header />
        </section>
      </mediaQueryContext.Provider>
    );
  }
}
