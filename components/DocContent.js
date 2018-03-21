import React from 'react';
import markdown from '../docs/Android-SDK/开发指南/创建项目/开发注意事项.md';

const DocContent = () => {
  // const { postmeta } = props;
  // const { content } = postmeta;
  // const html = md.render(content);
  const { content } = markdown;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: content
      }}
    >

    </div>
  )
}

export default DocContent;
