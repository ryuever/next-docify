import React from 'react';
import parseQuery from 'utils/parseQuery';
import toSlug from 'lib/utils/toSlug';

const dataSource = require.context('../docs/android-sdk', true, /\.md$/);

export default class DocContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      html: '',
    }
  }

  componentDidMount() {
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

  watchPathChange(page) {
    const { content } = dataSource(page);
    this.setState({
      html: content
    })
  }

  render() {
    const html = this.state.html;

    if (!html) return null;

    return (
      <div dangerouslySetInnerHTML={{
        __html: html
      }}/>
    )
  }
}
