import React from 'react';
import Link from 'next/link';
import normalizeUrlPath from '../utils/normalizeUrlPath';
import config from '../config';

const { publicPath } = config;

const PromotionBanner = () => {
  const banners = [{
    icon: 'ic_android',
    title: 'Android定位SDK v7.4',
    subTitle: '优化离线定位内部策略',
    isNew: true,
    href: '#',
  }, {
    icon: 'ic_gongju',
    title: '2018年春运出行仪表盘',
    subTitle: '春运综合出行信息播报',
    isNew: true,
    href: '#',
  }, {
    icon: 'ic_ios',
    title: 'iOS地图SDK v3.4.4',
    subTitle: '适配 iOS 11 定位',
    isNew: false,
    href: '#',
  }, {
    icon: 'ic_ios',
    title: 'iOS定位SDK v1.1',
    subTitle: '适配 iOS 11 永久定位的设置',
    isNew: false,
    href: '#',
  }];

  const createBanner = ({ icon, title, subTitle, isNew, href }, id) => (
    <li className="banner-item" key={id}>
      <Link href={href}>
        <a>
          <div
            className={`banner-icon ${icon}`}
            style={{
              backgroundImage: `url('${normalizeUrlPath(`./static/assets/${icon}.png`, publicPath)}')`
            }}
          />

          <div className="content">
            <p className="title">
              {title}
              {isNew ? <span className="new-banner">NEW !</span> : null}
            </p>
            <p className="sub-title">{subTitle}</p>
          </div>
        </a>
      </Link>

      <style jsx>{`
        .banner-item {
          flex: 1;
        }

        .banner-item:hover {
          background: #14161b;
          cursor: pointer;
        }

        a {
          display: inline-block;
          width: 100%;
          height: 100%;
          padding: 35px 0px 0px 21px;
          color: #8890a4;

          display: flex;
        }

        .banner-icon {
          background-repeat: no-repeat;
          background-position: top left;
          background-size: contain;
          margin-right: 11px;
          width: 45px;
        }

        .content {
          flex: auto;
        }

        .title {
          font-size: 16px;
          line-height: 30px;
        }

        .new-banner {
          width: 34px;
          height: 14px;
          font-style: italic;
          color: #ff280b;
          font-size: 12px;
          position: relative;
          top: -4px;
          left: 6px;
        }

        .sub-title {
          font-size: 12px;
          margin-top: -5px;
          line-height: 30px;
        }
      `}</style>
    </li>
  );

  return (
    <section className="promotion-banner">

      <ul className="banners">
        {banners.map((banner, id) => createBanner(banner, id))}
      </ul>

      <style jsx>{`
        .promotion-banner {
          width: 100%;
          height: 121px;
          position: absolute;
          bottom: 0;

          display: flex;
          justify-content: center;
          background: rgba(41,44,54,0.9);
        }

        .banners {
          width: 1200px;
          min-width: 1200px;
          display: flex;
        }
      `}
      </style>
    </section>
  )
}

export default PromotionBanner;
