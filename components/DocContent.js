import React from 'react';
import md from '../utils/markdownParser';

const DocContent = (props) => {
  const { postmeta } = props;
  const { content } = postmeta;

  const html = md.render(content);
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html
      }}
    >

    </div>
  )
}

export default DocContent;
