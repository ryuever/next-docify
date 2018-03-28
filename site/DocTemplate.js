import React from 'react';
import Template from '../pages/template';

const DocLayout = () => {

  return (
    <html>
      <head>
        <meta charSet="utf-8" className="next-head next-head" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/static/antd.min.css" />
      </head>

      <body>
        <Template />
        <script src="/static/bundle.js" type="text/javascript" />
      </body>
    </html>
  )
}

export default DocLayout;
