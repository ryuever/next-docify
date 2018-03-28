import React from 'react';
import normalizeUrlPath from 'utils/normalizeUrlPath';
import config from 'config';

const { publicPath, shouldNormalizeWithIndex } = config;

const SimpleNestedDisplay = (props) => {
  const { content } = props;

  const renderSub = (sub, id) => {
    const { title, href, query } = sub;
    let nextHref = `${normalizeUrlPath(href, publicPath, shouldNormalizeWithIndex)}${query ? `?${query}` : ''}`;

    return (
      <li key={id} className="sub-item">
        <a href={nextHref}>{title}</a>

        <style jsx>{`
          .sub-item {
            line-height: 40px;
          }

          a {
            width: 100%;
            display: inline-block;

            font-size: 14px;
            color: #8890a4;
            white-space: nowrap;
          }

          a:hover {
            color: #fc5f45;
            cursor: pointer;
          }
        `}
        </style>
      </li>
    )
  };

  const renderOne = (data, id) => {
    const { children: subs, title } = data;

    return (
      <li key={id} className="nested-display-item">
        <div className='item-wrapper'>
          <p className="title">{title}</p>
          <ul className="subs">
            {subs.map((data, id) => renderSub(data, id))}
          </ul>
        </div>

        <style jsx>{`
          .nested-display-item {
            flex: 1;

            display: flex;
            justify-content: center;
          }

          .item-wrapper {
            width: 133px;
          }

          .title {
            font-size: 16px;
            color: #fff;
            width: 133px;
            line-height: 60px;
          }

          .subs {
            display: flex;
            flex-direction: column;
          }
        `}
        </style>
      </li>
    )
  };

  return (
    <section className="simple-nested-display">
      <ul className="nested-display">
        {content.map((data, id) => renderOne(data, id))}
      </ul>

      <style jsx>{`
        .simple-nested-display {
          padding: 10px 100px;
        }

        .nested-display {
          display: flex;
        }
      `}
      </style>
    </section>
  )
};

export default SimpleNestedDisplay;
