import React from 'react';
import Remarkable from 'remarkable';

const DocContent = (props) => {
  const { postmeta } = props;
  const { content } = postmeta;

  const md = new Remarkable();
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
