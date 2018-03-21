import React from 'react';
// import md from 'libs/markdown-loader/Parser';
import markdown from 'docs/Android-SDK/开发指南/地图交互/控件和手势.md';

require.context('../docs', true, /\.md$/);

const DocContent = () => {
  // const { postmeta } = props;
  // const { content } = postmeta;
  // const html = md.render(content);
  const { content: html } = markdown;

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
