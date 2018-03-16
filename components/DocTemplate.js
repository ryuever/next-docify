import React from 'react';

import DocSidebar from './DocSidebar';
import DocContent from './DocContent';
const DocTemplate = (props) => {
  const { manifest, postmeta } = props;

  return (
    <div className="doc-template">
      <section className="sidebar">
        <div className="doc-belongs">Android地图SDK</div>
        <DocSidebar manifest={manifest}/>
      </section>

      <section className="main">
        <DocContent postmeta={postmeta}/>
      </section>

      <style jsx>{`
        .doc-template {
          width: 1200px;

          display: flex;
          justify-content: space-between;

          padding: 20px 0;
        }

        .doc-belongs {
          font-size: 14px;
          line-height: 55px;
          padding-left: 24px;
          color: #999;
        }

        .sidebar {
          width: 210px;
        }

        .main {
          width: 970px;
        }
      `}
      </style>
    </div>
  )
};

export default DocTemplate;
