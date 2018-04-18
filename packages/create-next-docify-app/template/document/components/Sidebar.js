import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TransitionMotion, Motion, spring } from 'react-motion';
import { mediaQueryContext } from '../context/mediaQueryContext';
import SidebarContentBody from './SidebarContentBody';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canUseDOM: false,
      onShow: props.showNav,
      maskerStyles: [],
      navBarStyles: [],
    };
  }

  componentDidMount() {
    this.setState({
      canUseDOM: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { showNav } = nextProps;
    const { onShow } = this.state;

    if (!onShow && showNav) {
      this.setState({
        onShow: true,
        maskerStyles: this.resolveMaskerStyles(true),
        navBarStyles: this.resolveSidebarContentStyles(true),
      });
      return;
    }

    if (onShow && !showNav) {
      this.setState({
        onShow: false,
        maskerStyles: this.resolveMaskerStyles(false),
        navBarStyles: this.resolveSidebarContentStyles(false),
      });
    }
  }

  toggleShowNav() {
    this.props.toggleNav();
  }

  resolveMaskerStyles(onShow) {
    if (onShow) {
      return [
        {
          key: 'masker',
          style: {
            opacity: spring(0.5),
            width: spring(100),
          },
        },
      ];
    }

    return [];
  }

  resolveSidebarContentStyles(onShow) {
    if (onShow) {
      return [
        {
          key: 'sidebar-content',
          style: {
            width: spring(100),
          },
        },
      ];
    }

    return [];
  }

  willMaskerLeave() {
    return {
      opacity: spring(0),
      width: spring(0),
    };
  }

  willMaskerEnter() {
    return {
      opacity: 0,
      width: 0,
    };
  }

  renderMasker() {
    return (
      <TransitionMotion
        willLeave={this.willMaskerLeave}
        willEnter={this.willMaskerEnter}
        styles={this.state.maskerStyles}
      >
        {styles => {
          if (styles.length === 0) return null;

          const style = styles[0].style;

          const nextStyle = {
            opacity: style.opacity,
            width: `${style.width}%`,
          };

          return (
            <div
              key={style.key}
              className="site-masker"
              style={nextStyle}
              onClick={this.toggleShowNav.bind(this)}
            >
              <style jsx>
                {`
                  .site-masker {
                    position: fixed;
                    top: 0;
                    height: 100%;
                    z-index: 10011;
                  }
                `}
              </style>
            </div>
          );
        }}
      </TransitionMotion>
    );
  }

  willSidebarContentLeave() {
    return {
      width: spring(0),
      // width: 0,
    };
  }

  willSidebarContentEnter() {
    return {
      width: 0,
    };
  }

  renderSidebarContent() {
    return (
      <mediaQueryContext.Consumer>
        {media => {
          return (
            <TransitionMotion
              willLeave={this.willSidebarContentLeave}
              willEnter={this.willSidebarContentEnter}
              styles={this.state.navBarStyles}
            >
              {styles => {
                if (styles.length === 0) return null;

                const { width, key } = styles[0].style;

                const { queryMatches } = media;

                const nextStyle = {
                  transform: `translateX(${width - 100}%)`,
                };

                {
                  /* if (!queryMatches.mobile) {
                  nextStyle.transform = `translateX(${(width - 100) * 3}px)`
                } */
                }

                return (
                  <div
                    key={key}
                    className={`sidebar-content`}
                    style={nextStyle}
                    onClick={this.toggleShowNav.bind(this)}
                  >
                    <SidebarContentBody
                      manifest={this.props.manifest}
                      postmeta={this.props.postmeta}
                      accessPath={this.props.accessPath}
                    />
                    <style jsx>
                      {`
                        .sidebar-content {
                          position: fixed;
                          top: 0;
                          background: #fff;
                          bottom: 0;
                          width: 300px;
                          z-index: 10012;
                        }

                        .sidebar-content.active {
                          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
                        }

                        @media screen and (max-width: 640px) {
                          .sidebar-content {
                            width: calc(100% - 128px);
                          }
                        }
                      `}
                    </style>
                  </div>
                );
              }}
            </TransitionMotion>
          );
        }}
      </mediaQueryContext.Consumer>
    );
  }

  renderSiderbar() {
    return (
      <div className="nav-responsive-wrapper" id="nav-responsive-wrapper">
        {this.renderMasker()}
        {this.renderSidebarContent()}
      </div>
    );
  }

  render() {
    const { canUseDOM } = this.state;
    const { showNav } = this.props;

    if (!canUseDOM) return null;

    if (canUseDOM) {
      const portal = document.querySelector('#nav-responsive-wrapper');

      const element = this.renderSiderbar();
      const container = document.body;
      return ReactDOM.createPortal(element, container);
    }
  }
}
