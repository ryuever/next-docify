import React from 'react';

import DocSidebar from './DocSidebar';
import DocContent from './DocContent';
const DocTemplate = (props) => {
  return (
    <div className="doc-template">
      <section className="sidebar">
        <DocSidebar />
      </section>

      <section className="main">
        <DocContent />
      </section>

      <style jsx>{`
        .doc-template {
          width: 1200px;

          display: flex;
          justify-content: space-between;
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
