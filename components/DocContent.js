import React from 'react';
import md from '../lib/markdown-loader/Parser';

// import markdown from '../docs/Android-SDK/开发指南/创建项目/开发注意事项.md';

const DocContent = (props) => {
  const { postmeta } = props;
  const { content } = postmeta;
  const html = md.render(content);
  // const { content } = markdown;

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
