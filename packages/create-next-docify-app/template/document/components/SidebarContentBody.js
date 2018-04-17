import React, { Component, Fragment } from 'react';
import siteConfig from '../site.config.js';

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
      accessPath: '/',
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
    values.push(about);
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
    const liClassName = `${
      currentPageAccessPath === accessPath ? 'active-item' : ''
    }`;
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

            li.active-item::before {
              width: 2px;
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
            ul {
              padding: 0;
              margin: 0;
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
              padding: 12px;
              background: #eceff1;
              position: relative;
              height: 24px;
            }

            i {
              position: absolute;
              top: 12px;
              font-size: 24px;
              color: #757575;
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
      const { children, title } = child;

      return (
        <div className="leve1 sidebar-section-header">
          <h3>{title}</h3>
          {this.renderChildren(children)}

          <style jsx>
            {`
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
    const { children, id, title, permalink } = child;
    const { accessPath } = this.props;
    const isPage = children.length === 0;
    const className = isPage ? ' section-page' : ' section-header';

    return (
      <div className="level-2" key={id}>
        <a href={`${accessPath}?title=${permalink}`} className={className}>
          {title}
        </a>
        {!isPage ? this.renderChildren(children) : null}
        <style jsx>
          {`
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
    const { postmeta } = this.props;
    const { children, id, title } = child;
    const isPage = children.length === 0;

    const className = isPage ? ' section-page' : ' section-header';

    return (
      <div className="level-3 box" key={id}>
        {isPage && (
          <a href="#" className={className}>
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
        <style jsx>{`
          .level-3 {
            position: relative;
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
        `}</style>
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
    return <div>{this.renderContent(this.state.nav)}</div>;
  }
}

export default SidebarContentBody;
