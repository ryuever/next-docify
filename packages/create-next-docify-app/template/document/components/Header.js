import React from 'react';
import { mediaQueryContext } from '../context/mediaQueryContext';

export default () => {
  const renderExpandNav = () => (
    <button key="render-expand-nav">
      <i className="fas fa-bars" />
      <style jsx>
        {`
          .fa-bars {
            font-size: 24px;
            line-height: 48px;
          }

          button {
            padding: 0;
            margin: 0;
            border: 0;
            background: transparent;
          }

          button:focus {
            outline: 0;
          }
        `}
      </style>
    </button>
  );

  const renderResponsive = queryMatches => {
    const items = [];
    if (queryMatches.mobile || queryMatches.tablet) {
      items.push(renderExpandNav());
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
          .top-section-main {
            height: 100%;
          }

          @media screen and (max-width: 720px) {
            .top-section {
              padding: 0 16px;
              height: 48px;
              background: #ef6c00;
            }
          }
        `}
      </style>
    </header>
  );
};
