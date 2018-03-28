import React from 'react';

const DocContent = ({ html }) => {
  if (!html) return null;

  return (
    <div dangerouslySetInnerHTML={{
      __html: html
    }}/>
  )
}

export default DocContent;
