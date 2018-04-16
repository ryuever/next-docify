import React, { Component } from 'react';

class SidebarContentBody extends Component {
  constructor(props) {
    super(props);

    const { manifest } = props;
    let values = [];
    this.navStack = [];
    if (manifest && manifest.length > 0) {
      values = manifest[0];
    }

    this.state = {
      values,
      baseDepth: 0,
    };
    this.navStack.push({
      values: this.state.values,
      baseDepth: this.state.baseDepth,
    });
  }

  handleGoBack(e) {
    e.stopPropagation();

    const len = this.navStack.length;

    if (len === 1) return;
    const current = this.navStack.pop();
    const next = this.navStack.slice(-1)[0];

    if (next) {
      this.setState(next);
    }
  }

  renderGoBack() {
    return (
      <div className="nav-go-back" onClick={this.handleGoBack.bind(this)}>
        <i className="fas fa-arrow-left" />
        <style jsx>
          {`
            .nav-go-back {
              padding: 12px;
              background: #eceff1;
            }

            i {
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
      const depthCase = depth - this.state.baseDepth;

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
    const { children, id, title } = child;
    const isPage = children.length === 0;
    const className = isPage ? ' section-page' : ' section-header';

    return (
      <div className="level-2" key={id}>
        <a href="#" className={className}>
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

    this.setState(data);
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

  renderContent(child) {
    return this.renderLevel1(child);
  }

  render() {
    const { manifest } = this.props;
    if (!manifest || manifest.length === 0) return null;

    return (
      <div>
        <div>
          {this.renderGoBack()}
          {this.renderContent(this.state.values)}
        </div>
      </div>
    );
  }
}

export default SidebarContentBody;
