import React from 'react';
import SimpleDefaultDisplay from './SimpleDefaultDisplay';
import SimpleNestedDisplay from './SimpleNestedDisplay';

const HeaderExtraAppender = (props) => {
  const { display, content } = props;

  const renderChildren = () => {
    if (display === 'default') return <SimpleDefaultDisplay content={content} />
    return <SimpleNestedDisplay content={content} />
  };

  return (
    <section className="header-extra">
      <div className="extra-container">
        {renderChildren()}
      </div>

      <style jsx>{`
        .header-extra {
          position: absolute;
          top: 70px;
          left: 0;
          right: 0;
          background: #21232b;

          display: flex;
          justify-content: center;
        }

        .extra-container {
          width: 1200px;
        }
      `}
      </style>
    </section>
  )
}

export default HeaderExtraAppender;
