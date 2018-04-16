import React from 'react';
import { mediaQueryContext } from '../context/mediaQueryContext';

export default props => {
  const handleToggle = () => {
    props.toggleNav();
  };

  const renderExpandNav = () => (
    <button onClick={handleToggle} key="render-expand-nav">
      <i className="fas fa-bars" />
      <style jsx>
        {`
          .fa-bars {
            font-size: 24px;
            line-height: 48px;
            color: #fff;
          }

          button {
            padding: 0;
            margin: 0;
            border: 0;
            background: transparent;
            margin-right: 16px;
          }

          button:focus {
            outline: 0;
          }
        `}
      </style>
    </button>
  );

  const renderTitle = () => {
    return (
      <div className="render-title" key="render-title">
        <a href="#">Document</a>

        <style jsx>
          {`
            .render-title {
              line-height: 48px;
              font-size: 20px;
            }

            a {
              text-decoration: none;
              color: #fff;
            }
          `}
        </style>
      </div>
    );
  };

  const renderResponsive = queryMatches => {
    const items = [];
    if (queryMatches.mobile || queryMatches.tablet) {
      items.push(renderExpandNav());
      items.push(renderTitle());
    }

    return items;
  };

  return (
    <header className="top-section">
      <mediaQueryContext.Consumer>
        {media => {
          const { queryMatches } = media;
          return (
            <section className="top-section-main">
              {renderResponsive(queryMatches)}
            </section>
          );
        }}
      </mediaQueryContext.Consumer>

      <style jsx>
        {`
          .top-section {
            height: 48px;
            background: #ef6c00;
          }

          .top-section-main {
            height: 100%;
            display: flex;
          }

          @media screen and (max-width: 960px) {
            .top-section {
              padding: 0 16px;
            }
          }
        `}
      </style>
    </header>
  );
};
