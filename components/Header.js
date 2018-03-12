import React from 'react';
import Router from 'next/router'
import Link from 'next/link';
import HeaderExtraAppender from 'components/HeaderExtraAppender';
import dataSource from 'dataSource';
import normalizeUrlPath from 'utils/normalizeUrlPath';
import config from 'config';

const { publicPath, shouldNormalizeWithIndex } = config;

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeService: null,
      isAuthed: false,
    };
  }

  onEnter(id) {
    this.setState({ activeService: id });
  }

  onLeave() {
    this.setState({ activeService: null });
  }

  handleRedirect(href) {
    Router.replace(href);
  }

  createServiceItem({ title, id, children, display, href }) {
    const { activeService } = this.state;
    let nextClassName = 'item' + (activeService === id ? ' active' : '');
    const nextHref = normalizeUrlPath(href, publicPath, shouldNormalizeWithIndex);

    return (
      <li
        key={id}
        className={nextClassName}
        onMouseEnter={this.onEnter.bind(this, id)}
        onMouseLeave={this.onLeave.bind(this, id)}
      >
        <div>
          {/* <Link href={nextHref}>
            <a href={nextHref}>{title}</a>
          </Link> */}
          <a href={nextHref}>{title}</a>
          {activeService === id && children && <div className="extra-appender">
            <HeaderExtraAppender
              content={children}
              display={display}
            />
          </div>
          }
        </div>

        <style jsx>{`
          .item {
            padding: 0 15px;
            font-size: 16px;
            color: #8890a4;
            line-height: 69px;
          }

          .item.active {
            cursor: pointer;
            border-bottom: 4px solid #f5533d;
            color: #fff;
          }

          a {
            display: inline-block;
            color: #8890a4;
          }

          a:hover {
            color: #fff;
            corsor: pointer;
          }
        `}
        </style>
      </li>
    )
  }

  renderAccountHolder() {
    const { isAuthed } = this.state;

    if (!isAuthed) {
      return (
        <div className="account-unauthed">
          <Link href="https://ipalmap.com/">
            <a>登录</a>
          </Link>
          <style jsx>{`
            .account-unauthed {
              height: 28px;
              width: 90px;
              background: #f5533d;
              border-radius: 35px;
              text-align: center;
              line-height: 28px;

              position: absolute;
              right: 48px;
              top: 50%;
              transform: translateY(-50%);
            }

            .account-unauthed a {
              color: #fff;
            }

            .account-unauthed:hover {
              cursor: pointer;
            }
          `}
          </style>
        </div>
      )
    }
  }

  render() {
    return (
      <section className="header-container">
        <div
          className="logo-holder"
          style={{
            backgroundImage: `url('${normalizeUrlPath('./static/assets/logo.png', publicPath)}')`
          }}
        />

        <div className="service-items">
          <ul className="service-list">
            {dataSource.map(data => this.createServiceItem(data))}
          </ul>
        </div>

        <div className="account-info">
          {this.renderAccountHolder()}
        </div>

        <ul className="account-appender" />

        <style jsx>{`
          .header-container {
            height: 100%;
            width: 100%;

            display: flex;
          }

          .logo-holder {
            width: 110px;
            margin-left: 48px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
          }

          .service-items {
            flex: auto;
            display: flex;
            justify-content: flex-end;
          }

          .service-list {
            display: flex;
          }

          .account-info {
            width: 185px;
            position: relative;
          }
        `}
        </style>
      </section>
    )
  }
}
