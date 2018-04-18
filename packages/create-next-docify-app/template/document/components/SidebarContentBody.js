import React, { Component, Fragment } from 'react';
import siteConfig from '../site.config.js';
import Traverser from 'somia/lib/Traverser';
import parseQuery from '../utils/parseQuery';

const keyToTagId = key => `docify-${key}`;

class SidebarContentBody extends Component {
  constructor(props) {
    super(props);

    const { manifest } = props;

    const homeSidebarValues = this.resolveHomeSidebarValues();

    let values = [];
    this.navStack = [];

    this.navStack.push({
      values: homeSidebarValues,
    });

    if (manifest && manifest.length > 0) {
      values = manifest[0];
      this.navStack.push({
        values,
        baseDepth: 0,
      });
    }

    this.state = {
      nav: this.navStack[this.navStack.length - 1],
    };

    this.activeKey = '';
  }

  componentDidUpdate() {
    const { manifest } = this.props;
    const { title } = parseQuery(window.location.search);

    if (manifest && !this.traverser) {
      this.traverser = new Traverser({
        data: manifest,
        primaryKey: 'key',
      });
    }

    if (this.traverser) {
      const data = this.traverser.query({
        permalink: title,
      });
      if (data && data.length > 0) {
        const key = data[0].key;
        const parentKeys = this.traverser.resolveParentKeys(key);
        const keysToTest = [].concat(parentKeys, key);
        const len = keysToTest.length;

        for (let i = len - 1; i >= 0; i--) {
          const k = keysToTest[i];
          const node = document.querySelector(`#${keyToTagId(k)}`);
          if (node) {
            if (!node.classList.contains('active')) {
              node.classList.add('active');
            }
            if (this.activeKey !== k) {
              const old = document.querySelector(
                `#${keyToTagId(this.activeKey)}`
              );
              old && old.classList.remove('active');
              node.classList.add('active');
              this.activeKey = k;
            }
            break;
          }
        }
      }
    }
  }

  resolveHomeSidebarValues() {
    const { docs } = siteConfig;
    const values = [];
    const home = {
      title: '首页',
      accessPath: '/',
    };
    const about = {
      title: '关于',
      accessPath: '/about',
    };

    values.push(home);
    docs.forEach(doc => {
      const { showOnSidebar, accessPath, indexDocPath, title } = doc;
      if (showOnSidebar) {
        values.push({
          title,
          accessPath: `${accessPath}?title=${indexDocPath}`,
          isDoc: true,
        });
      }
    });
    return values;
  }

  handleClickHomeSidebarItem(accessPath, e) {
    e.stopPropagation();
    const { accessPath: currentPageAccessPath, manifest } = this.props;

    if (accessPath === currentPageAccessPath) {
      const values = manifest[0];
      this.navStack.push({
        values,
        baseDepth: 0,
      });

      this.setState({
        nav: this.navStack[this.navStack.length - 1],
      });
    } else {
      window.location = accessPath;
    }
  }

  renderHomeSidebarItem(data, key) {
    const { title, accessPath, isDoc } = data;
    const { accessPath: currentPageAccessPath } = this.props;

    const className = `clickable-item${
      isDoc ? ' section-header' : ' section-page'
    }`;

    const shouldItemActive = accessPath => {
      const pathname = window.location.pathname;
      const accessPathname = accessPath.split('?')[0];

      if (pathname === accessPathname) return true;
      return false;
    };

    const liClassName = shouldItemActive(accessPath) ? 'active' : '';

    return (
      <li key={key} className={liClassName}>
        <div
          className={className}
          onClick={this.handleClickHomeSidebarItem.bind(this, accessPath)}
        >
          {title}
          {isDoc && <i className="fas fa-angle-right" />}
        </div>
        <style jsx>
          {`
            li {
              position: relative;
            }

            li.active::before {
              width: 4px;
              display: inline-block;
              content: '';
              height: 100%;
              position: absolute;
              background: rgba(141, 214, 249, 1);
            }

            .section-page {
              display: block;
              padding: 0.5em 17px;
              text-transform: capitalize;
              color: #666666;
            }

            .section-header {
              display: block;
              padding: 0.5em 17px;
              text-transform: capitalize;
              color: #666666;
            }

            i {
              position: absolute;
              top: 13px;
              right: 17px;
              font-size: 12px;
              color: #a5a1a1;
            }

            a {
              text-decoration: none;
            }
          `}
        </style>
      </li>
    );
  }

  renderHomeSidebar(values) {
    return (
      <section className="home-sidebar">
        <ul>
          {values.map((value, key) => this.renderHomeSidebarItem(value, key))}
        </ul>

        <style jsx>
          {`
            .home-sidebar {
              height: calc(100% - 48px);
            }

            ul {
              padding: 0;
              margin: 0;
              height: 100%;
              overflow-y: auto;
              list-style-type: none;
            }
          `}
        </style>
      </section>
    );
  }

  handleGoBack(e) {
    e.stopPropagation();

    const len = this.navStack.length;

    if (len === 1) return;

    this.navStack.pop();
    const next = this.navStack[this.navStack.length - 1];

    if (next) {
      this.setState({
        nav: next,
      });
    }
  }

  renderGoBack(flag) {
    return (
      <div className="nav-go-back" onClick={this.handleGoBack.bind(this)}>
        {!flag && <i className="fas fa-arrow-left" />}
        <style jsx>
          {`
            .nav-go-back {
              background: #eceff1;
              height: 48px;
              position: absolute;
              top: 0;
              width: 100%;
            }

            i {
              position: absolute;
              font-size: 24px;
              top: 12px;
              left: 12px;
              color: #757575;
              line-height: 24px;
            }
          `}
        </style>
      </div>
    );
  }

  renderChildren(children) {
    return children.map(child => {
      const { depth } = child;
      const elements = [];
      const depthCase = depth - this.state.nav.baseDepth;

      switch (depthCase) {
        case 2:
          elements.push(this.renderLevel2(child));
          break;
        case 3:
          elements.push(this.renderLevel3(child));
          break;
      }

      return elements;
    });
  }

  renderLevel1(child) {
    if (typeof child === 'object') {
      const { children, title, key } = child;

      return (
        <div className="level-1 sidebar-section-header" id={keyToTagId(key)}>
          <h3>{title}</h3>
          {this.renderChildren(children)}

          <style jsx>
            {`
              .level-1 {
                overflow-y: auto;
                height: calc(100% - 48px);
              }

              .level-1.active::before {
                width: 4px;
                display: inline-block;
                content: '';
                height: 100%;
                position: absolute;
                background: rgba(141, 214, 249, 1);
              }

              h3 {
                margin: 0;
              }

              .sidebar-section-header h3 {
                text-transform: uppercase;
                color: #2b3a42;
                padding: 0.75em 16px 0.25em;
                font-weight: 600;
              }
            `}
          </style>
        </div>
      );
    }

    if (Array.isArray(child)) {
      return this.renderLevel2(child);
    }
  }

  renderLevel2(child) {
    const { children, key, title, permalink } = child;
    const { accessPath } = this.props;
    const isPage = children.length === 0;

    let href = '#';
    let className = isPage ? ' section-page' : ' section-header';

    if (permalink) {
      href = `${accessPath}?title=${permalink}`;
    } else {
      className = `${className} disabled`;
    }

    return (
      <div className="level-2" key={key} id={keyToTagId(key)}>
        <a href={href} className={className}>
          {title}
        </a>
        {!isPage ? this.renderChildren(children) : null}
        <style jsx>
          {`
            .level-2 {
              position: relative;
            }

            .level-2.active::before {
              width: 4px;
              display: inline-block;
              content: '';
              height: 100%;
              position: absolute;
              background: rgba(141, 214, 249, 1);
            }

            .section-page {
              display: block;
              padding: 0.5em 17px;
              text-transform: capitalize;
              color: #666666;
            }

            .section-header {
              text-transform: uppercase;
              color: #658797;
              padding: 0.75em 16px 0.25em;
              font-weight: 600;
              display: block;
            }

            a {
              text-decoration: none;
            }

            .level-2:not(:first-child) {
              border-top: 1px solid #dedede;
            }
          `}
        </style>
      </div>
    );
  }

  handleRenderNextNav(child, e) {
    e.stopPropagation();
    const { depth } = child;
    const data = {
      values: child,
      baseDepth: depth - 1,
    };

    this.setState({
      nav: data,
    });
    this.navStack.push(data);
  }

  renderLevel3(child) {
    const { postmeta, accessPath } = this.props;
    const { children, key, title, permalink } = child;
    const isPage = children.length === 0;

    const className = isPage ? ' section-page' : ' section-header';

    return (
      <div className="level-3 box" key={key} id={keyToTagId(key)}>
        {isPage && (
          <a
            href={permalink ? `${accessPath}?title=${permalink}` : '#'}
            className={className}
          >
            {title}
          </a>
        )}

        {!isPage && (
          <div
            onClick={this.handleRenderNextNav.bind(this, child)}
            className={className}
          >
            {title}
          </div>
        )}
        {children.length > 0 && <i className="fas fa-angle-right" />}
        <style jsx>
          {`
            .level-3 {
              position: relative;
            }

            .level-3.active::before {
              width: 4px;
              display: inline-block;
              content: '';
              height: 100%;
              position: absolute;
              background: rgba(141, 214, 249, 1);
            }

            .section-page {
              display: block;
              padding: 0.5em 17px;
              text-transform: capitalize;
              color: #666666;
            }

            .section-header {
              display: block;
              padding: 0.5em 17px;
              text-transform: capitalize;
              color: #666666;
            }

            i {
              position: absolute;
              top: 13px;
              right: 17px;
              font-size: 12px;
              color: #a5a1a1;
            }

            a {
              text-decoration: none;
            }
          `}
        </style>
      </div>
    );
  }

  renderContent(content) {
    const { baseDepth, values } = content;

    if (typeof baseDepth === 'undefined') {
      return (
        <Fragment key="nav-group">
          {this.renderGoBack(true)}
          {this.renderHomeSidebar(values)}
        </Fragment>
      );
    }

    return (
      <Fragment key="nav-group">
        {this.renderGoBack()}
        {this.renderLevel1(values)}
      </Fragment>
    );
  }

  render() {
    return (
      <div className="sidebar-container">
        {this.renderContent(this.state.nav)}

        <style jsx>
          {`
            .sidebar-container {
              padding-top: 48px;
              height: 100%;
              display: flex;
              flex-direction: column;
            }
          `}
        </style>
      </div>
    );
  }
}

export default SidebarContentBody;
